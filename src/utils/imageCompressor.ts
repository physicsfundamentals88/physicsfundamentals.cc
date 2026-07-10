/**
 * Processes an image file for watermark removal.
 * - If a Gemini/banana watermark is detected in the bottom-right corner,
 *   the watermark is inpainted and the result is returned as WebP at quality 0.95.
 * - If NO watermark is detected, the original file is returned byte-for-byte unchanged
 *   (zero quality loss, zero blur, zero re-encoding).
 */
export async function compressToWebP(file: File): Promise<Blob> {
  // We only support images
  if (!file.type.startsWith("image/")) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = async () => {
        const width = img.width;
        const height = img.height;

        // Step 1: Draw the image to a canvas so we can scan its pixels.
        const scanCanvas = document.createElement("canvas");
        scanCanvas.width = width;
        scanCanvas.height = height;
        const scanCtx = scanCanvas.getContext("2d");
        if (!scanCtx) {
          resolve(file);
          return;
        }
        scanCtx.drawImage(img, 0, 0, width, height);

        // Step 2: Scan the bottom-right corner for a watermark.
        // If none is found, return the ORIGINAL file unchanged — no re-encoding,
        // no blur, no quality loss whatsoever.
        const watermarkFound = detectAndRemoveWatermark(scanCanvas);

        if (!watermarkFound) {
          resolve(file);
          return;
        }

        // Step 3: Watermark was detected and removed in-place on scanCanvas.
        // Export at very high quality (0.95) to keep the image as sharp as possible.
        scanCanvas.toBlob(
          (blob) => {
            resolve(blob || file);
          },
          "image/webp",
          0.95
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

/**
 * Compresses an image file and returns a new File object with a .webp extension
 */
export async function compressImageToFile(file: File): Promise<File> {
  // If the file is not an image, return it directly
  if (!file.type.startsWith("image/")) {
    return file;
  }

  try {
    const compressedBlob = await compressToWebP(file);
    // Replace extension with .webp
    const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
    return new File([compressedBlob], newName, { type: "image/webp" });
  } catch (error) {
    console.error("Image compression failed:", error);
    return file;
  }
}

/**
 * Scans the bottom-right corner of a canvas for known watermark color signatures
 * (Gemini sparkle white/grey, banana yellow, banana-stem brown).
 * If a watermark is found, it is inpainted in-place on the canvas.
 * Returns true if a watermark was detected and removed, false if the image is clean.
 */
function detectAndRemoveWatermark(canvas: HTMLCanvasElement): boolean {
  const ctx = canvas.getContext("2d");
  if (!ctx) return false;

  const width = canvas.width;
  const height = canvas.height;

  // Tight corner box: cap at 120px regardless of image size.
  // This keeps the scan away from image content (text, icons) that can appear
  // further from the corner, preventing false-positive watermark detections.
  const S = Math.min(120, Math.max(60, Math.floor(Math.min(width, height) * 0.30)));
  if (S <= 0) return false;

  const winX = width - S;
  const winY = height - S;

  const winImgData = ctx.getImageData(winX, winY, S, S);
  const winPixels = winImgData.data;

  // Scan the corner box for watermark colors to dynamically detect its bounding box
  let minX = S, maxX = -1, minY = S, maxY = -1;
  let matchCount = 0;

  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const idx = (y * S + x) * 4;
      const r = winPixels[idx];
      const g = winPixels[idx + 1];
      const b = winPixels[idx + 2];

      // 1. Yellow watermark (Banana body)
      const isYellow = r > 150 && g > 130 && b < 120 && (r - b > 40) && (g - b > 30);
      
      // 2. Brown watermark (Banana stem)
      const isBrown = r > 80 && g > 40 && b < 50 && (r - g < 60) && (r - b > 40);

      // 3. Bright White/Grey/Silver watermark (Gemini Sparkle — may have slight cool or warm tint)
      const isWhite = r > 165 && g > 165 && b > 165 && Math.abs(r - g) < 30 && Math.abs(g - b) < 30;

      if (isYellow || isBrown || isWhite) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        matchCount++;
      }
    }
  }

  // Only inpaint if we found a clearly localized, compact watermark shape.
  // Guards:
  //   matchCount > 5          — rules out random noise pixels
  //   matchCount < S*S*0.60   — rules out images with mostly white/yellow backgrounds
  //   bboxArea < 6000         — watermarks are small (< ~78×78 px); large regions are image content
  const bboxW = maxX - minX + 1;
  const bboxH = maxY - minY + 1;
  const bboxArea = bboxW * bboxH;
  if (matchCount <= 5 || matchCount >= (S * S * 0.60) || bboxArea > 6000) {
    // No confident watermark detection — do NOT touch the image.
    return false;
  }

  const dilatedMask = Array.from({ length: S }, () => new Uint8Array(S));

  // Add 8px padding around the detected watermark bounding box to cover anti-aliased edges
  const pad = 8;
  const startX = Math.max(0, minX - pad);
  const endX = Math.min(S - 1, maxX + pad);
  const startY = Math.max(0, minY - pad);
  const endY = Math.min(S - 1, maxY + pad);

  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      dilatedMask[y][x] = 1;
    }
  }

  // Wavefront propagation: fill the masked region by blending surrounding unmasked pixels
  const workingPixels = new Uint8ClampedArray(winPixels);
  let maskedCount = 0;
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      if (dilatedMask[y][x]) maskedCount++;
    }
  }

  const maxIterations = S * 3;
  let iterations = 0;
  while (maskedCount > 0 && iterations < maxIterations) {
    iterations++;
    const toUpdate: { x: number; y: number; r: number; g: number; b: number }[] = [];

    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        if (!dilatedMask[y][x]) continue;
        let sumR = 0, sumG = 0, sumB = 0, count = 0;
        for (let ny = y - 1; ny <= y + 1; ny++) {
          for (let nx = x - 1; nx <= x + 1; nx++) {
            if (nx >= 0 && nx < S && ny >= 0 && ny < S && !dilatedMask[ny][nx]) {
              const idx = (ny * S + nx) * 4;
              sumR += workingPixels[idx];
              sumG += workingPixels[idx + 1];
              sumB += workingPixels[idx + 2];
              count++;
            }
          }
        }
        if (count > 0) {
          toUpdate.push({
            x, y,
            r: Math.round(sumR / count),
            g: Math.round(sumG / count),
            b: Math.round(sumB / count),
          });
        }
      }
    }

    if (toUpdate.length === 0) break;

    for (const item of toUpdate) {
      const idx = (item.y * S + item.x) * 4;
      workingPixels[idx] = item.r;
      workingPixels[idx + 1] = item.g;
      workingPixels[idx + 2] = item.b;
      dilatedMask[item.y][item.x] = 0;
      maskedCount--;
    }
  }

  winImgData.data.set(workingPixels);
  ctx.putImageData(winImgData, winX, winY);
  return true;
}
