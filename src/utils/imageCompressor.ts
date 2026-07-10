/**
 * Image compressor with Gemini watermark removal.
 *
 * 1. ALWAYS converts any uploaded image to WebP at quality 0.92 (compression).
 * 2. Scans the bottom-right corner for a Gemini/Nano-Banana watermark using
 *    LOCAL CONTRAST detection (not fixed color thresholds), so it works on
 *    dark, medium, and light backgrounds alike.
 * 3. If a watermark is found, it is inpainted before the WebP export.
 */

export async function compressToWebP(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        // Draw the original image at full resolution
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Attempt to detect and remove watermark (modifies canvas in-place)
        detectAndRemoveWatermark(canvas);

        // ALWAYS export as WebP at 0.92 quality — guarantees compression + format conversion
        canvas.toBlob(
          (blob) => resolve(blob || file),
          "image/webp",
          0.92
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

/**
 * Compresses an image file and returns a new File object with a .webp extension.
 */
export async function compressImageToFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  try {
    const compressedBlob = await compressToWebP(file);
    const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
    return new File([compressedBlob], newName, { type: "image/webp" });
  } catch (error) {
    console.error("Image compression failed:", error);
    return file;
  }
}

// ---------------------------------------------------------------------------
// Watermark detection & removal
// ---------------------------------------------------------------------------

/**
 * Detects and removes Gemini / Nano-Banana watermarks from the bottom-right
 * corner of a canvas using TWO complementary strategies:
 *
 *   A) **Local contrast** — finds pixels significantly brighter than the
 *      average background luminance of the corner box. This catches the
 *      semi-transparent Gemini sparkle on ANY background (dark, medium, light).
 *
 *   B) **Absolute color** — catches saturated banana-yellow / brown pixels
 *      that the luminance check might miss if the background is also bright.
 *
 * Only inpaints when the detected region is compact (< 60×60 px bounding box)
 * to avoid damaging legitimate image content.
 */
function detectAndRemoveWatermark(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // Scan a fixed 80×80 region anchored to the very bottom-right corner.
  // Gemini sparkles live within ~40px of the corner. 80px gives enough
  // padding for the background reference ring while staying away from
  // actual image content (labels, icons) that sit further from the edge.
  const S = Math.min(80, width, height);
  if (S < 30) return;

  const winX = width - S;
  const winY = height - S;
  const winImgData = ctx.getImageData(winX, winY, S, S);
  const winPixels = winImgData.data;

  // ── Step 1: Compute background luminance from the outer border ring ──
  // Use the top 25% rows and left 25% columns of the box as "background".
  const border = Math.max(10, Math.floor(S * 0.25));
  let bgLumSum = 0;
  let bgCount = 0;
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      if (y < border || x < border) {
        const idx = (y * S + x) * 4;
        bgLumSum += winPixels[idx] * 0.299 + winPixels[idx + 1] * 0.587 + winPixels[idx + 2] * 0.114;
        bgCount++;
      }
    }
  }
  const bgLum = bgLumSum / (bgCount || 1);

  // ── Step 2: Scan the inner region for watermark pixels ──
  // A pixel is flagged if it matches EITHER criterion:
  //   (a) Local contrast: luminance > background + adaptive threshold
  //       AND low saturation (white/grey sparkle, not colored content)
  //   (b) Absolute color: banana-yellow or banana-brown regardless of bg
  const lumThreshold = bgLum + Math.max(20, bgLum * 0.20);

  let minX = S, maxX = -1, minY = S, maxY = -1;
  let matchCount = 0;

  for (let y = border; y < S; y++) {
    for (let x = border; x < S; x++) {
      const idx = (y * S + x) * 4;
      const r = winPixels[idx];
      const g = winPixels[idx + 1];
      const b = winPixels[idx + 2];

      // (a) Local contrast: brighter than background AND low-saturation
      const lum = r * 0.299 + g * 0.587 + b * 0.114;
      const maxC = Math.max(r, g, b);
      const minC = Math.min(r, g, b);
      const sat = maxC > 0 ? (maxC - minC) / maxC : 0;
      const isBrightSparkle = lum > lumThreshold && sat < 0.35;

      // (b) Absolute banana yellow / brown (works on any background)
      const isYellow = r > 150 && g > 130 && b < 120 && (r - b > 40) && (g - b > 30);
      const isBrown = r > 80 && g > 40 && b < 50 && (r - g < 60) && (r - b > 40);

      if (isBrightSparkle || isYellow || isBrown) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        matchCount++;
      }
    }
  }

  // ── Step 3: Validate — must be compact & localized ──
  if (matchCount < 3) return; // too few pixels — no watermark

  const bboxW = maxX - minX + 1;
  const bboxH = maxY - minY + 1;
  const innerArea = (S - border) * (S - border);

  // Reject if the bounding box is too large (image content, not a tiny watermark)
  if (bboxW > 55 || bboxH > 55) return;
  // Reject if too many pixels matched (background is white/yellow, not a watermark)
  if (matchCount > innerArea * 0.55) return;

  // ── Step 4: Build mask with padding & inpaint ──
  const dilatedMask = Array.from({ length: S }, () => new Uint8Array(S));
  const pad = 6;
  const sX = Math.max(0, minX - pad);
  const eX = Math.min(S - 1, maxX + pad);
  const sY = Math.max(0, minY - pad);
  const eY = Math.min(S - 1, maxY + pad);

  for (let y = sY; y <= eY; y++) {
    for (let x = sX; x <= eX; x++) {
      dilatedMask[y][x] = 1;
    }
  }

  // Wavefront propagation: iteratively replace masked pixels with the average
  // of their unmasked neighbors until every masked pixel is filled.
  const working = new Uint8ClampedArray(winPixels);
  let remaining = 0;
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      if (dilatedMask[y][x]) remaining++;
    }
  }

  const maxIter = S * 3;
  let iter = 0;
  while (remaining > 0 && iter < maxIter) {
    iter++;
    const updates: { x: number; y: number; r: number; g: number; b: number }[] = [];

    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        if (!dilatedMask[y][x]) continue;
        let sR = 0, sG = 0, sB = 0, cnt = 0;
        for (let ny = y - 1; ny <= y + 1; ny++) {
          for (let nx = x - 1; nx <= x + 1; nx++) {
            if (nx >= 0 && nx < S && ny >= 0 && ny < S && !dilatedMask[ny][nx]) {
              const i = (ny * S + nx) * 4;
              sR += working[i];
              sG += working[i + 1];
              sB += working[i + 2];
              cnt++;
            }
          }
        }
        if (cnt > 0) {
          updates.push({ x, y, r: Math.round(sR / cnt), g: Math.round(sG / cnt), b: Math.round(sB / cnt) });
        }
      }
    }

    if (updates.length === 0) break;

    for (const u of updates) {
      const i = (u.y * S + u.x) * 4;
      working[i] = u.r;
      working[i + 1] = u.g;
      working[i + 2] = u.b;
      dilatedMask[u.y][u.x] = 0;
      remaining--;
    }
  }

  winImgData.data.set(working);
  ctx.putImageData(winImgData, winX, winY);
}
