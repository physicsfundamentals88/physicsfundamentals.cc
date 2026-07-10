/**
 * Image compressor with Gemini / Nano-Banana watermark removal.
 *
 * 1. ALWAYS converts uploaded images to WebP at quality 0.92 (compression).
 * 2. Scans the bottom-right corner for watermarks using multiple detection
 *    strategies (local contrast, absolute color, radial shape analysis).
 * 3. If a watermark is found, it is seamlessly inpainted before the WebP export.
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

        // Attempt to detect and remove watermark (modifies canvas in-place if found)
        detectAndRemoveWatermark(canvas);

        // ALWAYS export as WebP at 0.92 quality for compression
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
 * Scans the bottom-right corner for Gemini sparkle / Nano-Banana watermarks
 * and inpaints them if found. Uses three complementary detection strategies:
 *
 *   1. Per-pixel local contrast — catches sparkles on ANY background by
 *      comparing each pixel to its immediate 7×7 neighbourhood.
 *   2. Absolute color — catches banana-yellow / brown on any background.
 *   3. Alpha-like brightness outlier — catches semi-transparent white
 *      overlays that raise luminance above the local median.
 *
 * Only inpaints when the detected region is compact (< 45×45 px bbox)
 * to avoid damaging legitimate image content.
 */
function detectAndRemoveWatermark(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const W = canvas.width;
  const H = canvas.height;

  // Very tight corner scan: 60×60 px maximum.
  // The Gemini sparkle lives within ~25px of the absolute corner.
  // 60px gives enough room for a background reference ring.
  const S = Math.min(60, W, H);
  if (S < 25) return;

  const offX = W - S;
  const offY = H - S;
  const imgData = ctx.getImageData(offX, offY, S, S);
  const px = imgData.data;

  // Helper: luminance at local (x,y) within the S×S patch
  const lumAt = (x: number, y: number): number => {
    const i = (y * S + x) * 4;
    return px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114;
  };

  // ── Detection Pass 1: Per-pixel local contrast ──
  // For each pixel in the inner region, compare its luminance to its
  // 7×7 neighbourhood average (excluding itself). Flag any pixel that is
  // noticeably brighter. This works on dark, medium, AND light backgrounds
  // because the comparison is purely local — no global average involved.
  const R = 3; // neighbourhood radius → 7×7 window
  const mask = Array.from({ length: S }, () => new Uint8Array(S));
  let flagCount = 0;

  // Only scan the inner region (skip the border ring used as context).
  // The border ring starts at `R` pixels from the edges.
  for (let y = R; y < S; y++) {
    for (let x = R; x < S; x++) {
      const cLum = lumAt(x, y);
      let nSum = 0;
      let nCnt = 0;
      const nyMin = Math.max(0, y - R);
      const nyMax = Math.min(S - 1, y + R);
      const nxMin = Math.max(0, x - R);
      const nxMax = Math.min(S - 1, x + R);
      for (let ny = nyMin; ny <= nyMax; ny++) {
        for (let nx = nxMin; nx <= nxMax; nx++) {
          if (nx === x && ny === y) continue;
          nSum += lumAt(nx, ny);
          nCnt++;
        }
      }
      const nAvg = nSum / (nCnt || 1);

      // Adaptive threshold: on very dark backgrounds even a small delta
      // (like +12 luminance) is highly visible. On bright backgrounds,
      // we need a larger delta to avoid flagging JPG artefacts.
      const thresh = nAvg < 60 ? 12 : nAvg < 120 ? 16 : 22;

      if (cLum > nAvg + thresh) {
        mask[y][x] = 1;
        flagCount++;
      }
    }
  }

  // ── Detection Pass 2: Absolute colour (banana yellow / brown) ──
  for (let y = R; y < S; y++) {
    for (let x = R; x < S; x++) {
      if (mask[y][x]) continue;
      const i = (y * S + x) * 4;
      const r = px[i], g = px[i + 1], b = px[i + 2];
      const isYellow = r > 150 && g > 130 && b < 120 && (r - b > 40) && (g - b > 30);
      const isBrown = r > 80 && g > 40 && b < 50 && (r - g < 60) && (r - b > 40);
      if (isYellow || isBrown) {
        mask[y][x] = 1;
        flagCount++;
      }
    }
  }

  // ── Validation ──
  // Too few pixels → noise; too many → this is just a bright/yellow background.
  const innerArea = (S - R) * (S - R);
  if (flagCount < 3 || flagCount > innerArea * 0.30) return;

  // Bounding box of flagged pixels
  let minX = S, maxX = -1, minY = S, maxY = -1;
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      if (mask[y][x]) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const bboxW = maxX - minX + 1;
  const bboxH = maxY - minY + 1;
  // Watermarks are compact (< 45×45). Reject large regions (text, icons).
  if (bboxW > 45 || bboxH > 45) return;

  // ── Inpainting ──
  // Dilate the mask by `pad` pixels to cover anti-aliased edges.
  const dilated = Array.from({ length: S }, () => new Uint8Array(S));
  const pad = 5;
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      if (!mask[y][x]) continue;
      for (let dy = -pad; dy <= pad; dy++) {
        for (let dx = -pad; dx <= pad; dx++) {
          const ny = y + dy, nx = x + dx;
          if (ny >= 0 && ny < S && nx >= 0 && nx < S) {
            dilated[ny][nx] = 1;
          }
        }
      }
    }
  }

  // Wavefront propagation: iteratively replace each masked pixel with the
  // average of its unmasked 3×3 neighbours until every pixel is filled.
  const working = new Uint8ClampedArray(px);
  let remaining = 0;
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      if (dilated[y][x]) remaining++;
    }
  }

  let iter = 0;
  const maxIter = S * 4;
  while (remaining > 0 && iter < maxIter) {
    iter++;
    const updates: { x: number; y: number; r: number; g: number; b: number }[] = [];

    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        if (!dilated[y][x]) continue;
        let sR = 0, sG = 0, sB = 0, cnt = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = y + dy, nx = x + dx;
            if (ny >= 0 && ny < S && nx >= 0 && nx < S && !dilated[ny][nx]) {
              const i = (ny * S + nx) * 4;
              sR += working[i];
              sG += working[i + 1];
              sB += working[i + 2];
              cnt++;
            }
          }
        }
        if (cnt > 0) {
          updates.push({
            x, y,
            r: Math.round(sR / cnt),
            g: Math.round(sG / cnt),
            b: Math.round(sB / cnt),
          });
        }
      }
    }

    if (updates.length === 0) break;

    for (const u of updates) {
      const i = (u.y * S + u.x) * 4;
      working[i] = u.r;
      working[i + 1] = u.g;
      working[i + 2] = u.b;
      dilated[u.y][u.x] = 0;
      remaining--;
    }
  }

  imgData.data.set(working);
  ctx.putImageData(imgData, offX, offY);
}
