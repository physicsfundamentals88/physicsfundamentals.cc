/**
 * Image compressor with Gemini / Nano-Banana watermark removal from scratch.
 *
 * 1. ALWAYS converts uploaded images to WebP format at 0.92 quality (compression).
 * 2. Scans the bottom-right corner for Gemini sparkle or Nano-Banana watermarks.
 * 3. Replaces only the watermark pixels with the local background color to keep the image sharp and unaffected.
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

        // Draw original image at full resolution
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Remove watermark in-place
        detectAndRemoveWatermark(canvas);

        // ALWAYS compress and convert to WebP
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

/**
 * Detects and removes Gemini/Nano-Banana watermarks from the bottom-right corner.
 * Only replaces the specific watermark pixels with local background color,
 * ensuring the rest of the image is completely unaffected and sharp.
 */
function detectAndRemoveWatermark(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const W = canvas.width;
  const H = canvas.height;

  // We scan a 60x60 corner box
  const S = Math.min(60, W, H);
  if (S < 30) return;

  const offX = W - S;
  const offY = H - S;

  const imgData = ctx.getImageData(offX, offY, S, S);
  const px = imgData.data;

  // Step 1: Calculate the average background color from the outer borders of the patch
  let bgR = 0, bgG = 0, bgB = 0, bgCount = 0;
  const border = 12; // Outer 12 pixels are considered background

  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      if (x < border || y < border) {
        const i = (y * S + x) * 4;
        bgR += px[i];
        bgG += px[i + 1];
        bgB += px[i + 2];
        bgCount++;
      }
    }
  }

  bgR = Math.round(bgR / (bgCount || 1));
  bgG = Math.round(bgG / (bgCount || 1));
  bgB = Math.round(bgB / (bgCount || 1));
  const bgLum = bgR * 0.299 + bgG * 0.587 + bgB * 0.114;

  // Step 2: Scan the inner region for watermark pixels
  const watermarkMask = Array.from({ length: S }, () => new Uint8Array(S));
  let matchCount = 0;

  for (let y = border; y < S; y++) {
    for (let x = border; x < S; x++) {
      const i = (y * S + x) * 4;
      const r = px[i];
      const g = px[i + 1];
      const b = px[i + 2];

      const lum = r * 0.299 + g * 0.587 + b * 0.114;
      const maxVal = Math.max(r, g, b);
      const minVal = Math.min(r, g, b);
      const sat = maxVal > 0 ? (maxVal - minVal) / maxVal : 0;

      // Gemini Sparkle (lighter/brighter than background, low saturation)
      const isSparkle = lum > bgLum + 20 && sat < 0.40;

      // Nano Banana (yellow/brown body)
      const isYellow = r > 150 && g > 130 && b < 120 && (r - b > 40) && (g - b > 30);
      const isBrown = r > 80 && g > 40 && b < 50 && (r - g < 60) && (r - b > 40);

      if (isSparkle || isYellow || isBrown) {
        watermarkMask[y][x] = 1;
        matchCount++;
      }
    }
  }

  // Step 3: Validate matches — must be a localized watermark shape
  if (matchCount < 4 || matchCount > (S * S * 0.35)) {
    return; // No watermark or background is too busy
  }

  // Find bounding box
  let minX = S, maxX = -1, minY = S, maxY = -1;
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      if (watermarkMask[y][x]) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const bboxW = maxX - minX + 1;
  const bboxH = maxY - minY + 1;
  if (bboxW > 45 || bboxH > 45) {
    return; // Bounding box is too large (likely text or regular image content)
  }

  // Step 4: Expand/dilate the mask slightly to cover anti-aliased edge pixels
  const dilatedMask = Array.from({ length: S }, () => new Uint8Array(S));
  const pad = 3; // minimal padding to avoid blurring surrounding content
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      if (watermarkMask[y][x]) {
        for (let dy = -pad; dy <= pad; dy++) {
          for (let dx = -pad; dx <= pad; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            if (ny >= 0 && ny < S && nx >= 0 && nx < S) {
              dilatedMask[ny][nx] = 1;
            }
          }
        }
      }
    }
  }

  // Step 5: Replace only the masked pixels.
  // Instead of global blur, we replace each masked pixel with the local background color.
  // This completely prevents blurring of clean, unmasked areas.
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      if (dilatedMask[y][x]) {
        const i = (y * S + x) * 4;
        px[i] = bgR;
        px[i + 1] = bgG;
        px[i + 2] = bgB;
      }
    }
  }

  // Save the modified pixels back to the canvas
  imgData.data.set(px);
  ctx.putImageData(imgData, offX, offY);
}
