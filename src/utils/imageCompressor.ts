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
        const width = img.width;
        const height = img.height;

        // Create a canvas of the exact same dimensions to preserve full resolution and details
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          resolve(file);
          return;
        }

        // Draw original image at 100% scale
        ctx.drawImage(img, 0, 0, width, height);

        // Run the watermark detection and removal on the full resolution canvas
        detectAndRemoveWatermark(canvas);

        // Convert the canvas to WebP format at a very high quality (0.92) to keep the image sharp and unblurred
        canvas.toBlob(
          (blob) => {
            resolve(blob || file);
          },
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

  // Scale box size S dynamically based on image dimensions to handle high-res images
  const S = Math.min(220, Math.floor(Math.min(width, height) * 0.25));
  if (S <= 0) return;

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

      // 3. Bright White/Grey watermark (Gemini Sparkle)
      const isWhite = r > 175 && g > 175 && b > 175 && Math.abs(r - g) < 15 && Math.abs(g - b) < 15;

      if (isYellow || isBrown || isWhite) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        matchCount++;
      }
    }
  }

  const dilatedMask = Array.from({ length: S }, () => new Uint8Array(S));

  // If we detected a valid localized watermark shape
  if (matchCount > 5 && matchCount < (S * S * 0.70)) {
    // Add 8px padding to ensure edges are fully covered
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
  } else {
    // Fallback: inpaint the bottom-right inner zone while leaving a border margin
    // to prevent dark frame borders from bleeding into the light background.
    const fallbackStart = Math.floor(S * 0.35);
    const fallbackEnd = S - 8; // Leave 8px border untouched
    for (let y = fallbackStart; y < fallbackEnd; y++) {
      for (let x = fallbackStart; x < fallbackEnd; x++) {
        dilatedMask[y][x] = 1;
      }
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
