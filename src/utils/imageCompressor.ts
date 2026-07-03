/**
 * Compresses an image file, converting it to WebP format,
 * and attempting to reduce its file size to the target range of 100KB - 150KB.
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
        let width = img.width;
        let height = img.height;

        // Configuration
        const MAX_RESOLUTION = 1200;
        const TARGET_MIN_SIZE = 100 * 1024; // 100 KB
        const TARGET_MAX_SIZE = 150 * 1024; // 150 KB

        // Scale down initially if it exceeds max resolution
        if (width > MAX_RESOLUTION || height > MAX_RESOLUTION) {
          const ratio = Math.min(MAX_RESOLUTION / width, MAX_RESOLUTION / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // Create a temporary canvas to check and remove watermarks once
        const cleanCanvas = document.createElement("canvas");
        cleanCanvas.width = width;
        cleanCanvas.height = height;
        const cleanCtx = cleanCanvas.getContext("2d");
        if (cleanCtx) {
          cleanCtx.drawImage(img, 0, 0, width, height);
          detectAndRemoveWatermark(cleanCanvas);
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let quality = 0.85;
        let scale = 1.0;
        let bestBlob: Blob | null = null;
        let bestDiff = Infinity;

        // Iteratively try to find the quality/resolution that fits the target size.
        // We do up to 5 attempts to converge close to the 100KB-150KB budget.
        for (let i = 0; i < 5; i++) {
          const currentWidth = Math.round(width * scale);
          const currentHeight = Math.round(height * scale);

          canvas.width = currentWidth;
          canvas.height = currentHeight;
          ctx?.clearRect(0, 0, currentWidth, currentHeight);
          // Draw from the watermark-free clean canvas
          ctx?.drawImage(cleanCanvas, 0, 0, currentWidth, currentHeight);

          const blob = await new Promise<Blob | null>((res) => {
            canvas.toBlob((b) => res(b), "image/webp", quality);
          });

          if (!blob) break;

          // If the original file is small and even at 0.85 quality it's less than 100KB,
          // we should just return it. No need to artificially inflate it.
          if (file.size < TARGET_MIN_SIZE && i === 0) {
            bestBlob = blob;
            break;
          }

          const size = blob.size;

          // If it fits in the target range, we are done!
          if (size >= TARGET_MIN_SIZE && size <= TARGET_MAX_SIZE) {
            bestBlob = blob;
            break;
          }

          // Keep track of the one closest to the range
          let diff = 0;
          if (size < TARGET_MIN_SIZE) {
            diff = TARGET_MIN_SIZE - size;
          } else {
            diff = size - TARGET_MAX_SIZE;
          }

          if (diff < bestDiff) {
            bestDiff = diff;
            bestBlob = blob;
          }

          // Adjust parameters for the next iteration
          if (size > TARGET_MAX_SIZE) {
            // File is too large, reduce quality or scale down
            if (quality > 0.4) {
              quality -= 0.15;
            } else if (scale > 0.5) {
              scale -= 0.2;
              quality = 0.7; // reset quality somewhat when scaling down
            } else {
              break;
            }
          } else {
            // File is too small (< 100KB), but the original was larger than 150KB.
            // This means we compressed too much in a previous step, so we can afford slightly higher quality.
            if (quality < 0.95) {
              quality += 0.05;
            } else if (scale < 1.0) {
              scale += 0.1;
            } else {
              break;
            }
          }
        }

        resolve(bestBlob || file);
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

function detectAndRemoveWatermark(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // Always inpaint the bottom-right corner area (up to 120×120 px).
  // This universally removes any watermark regardless of color (Gemini G logo,
  // sparkle shape, banana logo, etc.) by blending surrounding pixel colors.
  const S = Math.min(120, width, height);
  const winX = width - S;
  const winY = height - S;

  if (S <= 0) return;

  const winImgData = ctx.getImageData(winX, winY, S, S);
  const winPixels = winImgData.data;

  // Build a mask that covers the inner portion of the corner (avoids false-
  // positives on clean background images by only replacing the inner 60% zone)
  const innerStart = Math.floor(S * 0.4);
  const dilatedMask = Array.from({ length: S }, () => new Uint8Array(S));

  // Mark the inner 60% × 60% of the corner as "to inpaint"
  for (let y = innerStart; y < S; y++) {
    for (let x = innerStart; x < S; x++) {
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
}
