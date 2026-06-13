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

  // We scan the bottom-right region (up to 240x240 pixels)
  const searchWidth = Math.min(width, 240);
  const searchHeight = Math.min(height, 240);
  const startX = width - searchWidth;
  const startY = height - searchHeight;

  if (searchWidth <= 0 || searchHeight <= 0) return;

  // Single getImageData call for the entire search area to optimize performance
  const imgData = ctx.getImageData(startX, startY, searchWidth, searchHeight);
  const pixels = imgData.data;

  // Helper function to analyze a sliding window of size S at (wx, wy) relative to search area
  const checkWindow = (wx: number, wy: number, S: number) => {
    let centerWhite = 0;
    let centerYellow = 0;
    let centerLuminosity = 0;
    let centerCount = 0;

    let cornerWhite = 0;
    let cornerYellow = 0;
    let cornerLuminosity = 0;
    let cornerCount = 0;

    const cStart = Math.floor(S * 0.25);
    const cEnd = Math.floor(S * 0.75);
    const cornerSize = Math.floor(S * 0.15);

    for (let dy = 0; dy < S; dy++) {
      const y = wy + dy;
      for (let dx = 0; dx < S; dx++) {
        const x = wx + dx;

        const idx = (y * searchWidth + x) * 4;
        const r = pixels[idx];
        const g = pixels[idx + 1];
        const b = pixels[idx + 2];
        const a = pixels[idx + 3];

        // Skip highly transparent pixels
        if (a < 50) continue;

        const val = (r + g + b) / 3;
        const maxCh = Math.max(r, g, b);
        const minCh = Math.min(r, g, b);

        // White/gray detection (Gemini sparkle logo):
        // Bright enough and low saturation
        const isWhite = val > 120 && (maxCh - minCh) < 30;

        // Yellow detection (Banana logo):
        // High red/green, low blue, close R/G difference
        const isYellow = r > 120 && g > 120 && b < 130 && (r - b) > 35 && (g - b) > 35 && Math.abs(r - g) < 60;

        if (dx >= cStart && dx < cEnd && dy >= cStart && dy < cEnd) {
          centerCount++;
          centerLuminosity += val;
          if (isWhite) centerWhite++;
          if (isYellow) centerYellow++;
        } else if (
          (dx < cornerSize && dy < cornerSize) ||
          (dx >= S - cornerSize && dy < cornerSize) ||
          (dx < cornerSize && dy >= S - cornerSize) ||
          (dx >= S - cornerSize && dy >= S - cornerSize)
        ) {
          cornerCount++;
          cornerLuminosity += val;
          if (isWhite) cornerWhite++;
          if (isYellow) cornerYellow++;
        }
      }
    }

    if (centerCount === 0 || cornerCount === 0) return null;

    const avgCenterLum = centerLuminosity / centerCount;
    const avgCornerLum = cornerLuminosity / cornerCount;

    const centerWhitePct = centerWhite / centerCount;
    const cornerWhitePct = cornerWhite / cornerCount;

    const centerYellowPct = centerYellow / centerCount;
    const cornerYellowPct = cornerYellow / cornerCount;

    // Strict Criteria to avoid false positives:
    // 1. Google Gemini Sparkle:
    //    - Center has white pixels (>= 5%)
    //    - Center has higher white density than corners by at least 5%
    //    - Corners have very few white pixels (< 3%) to ensure it is a local element, not a white background or text
    //    - Center is average brighter than corners (diff > 15)
    const geminiDetected = centerWhitePct > 0.05 && 
                           (centerWhitePct - cornerWhitePct) > 0.05 && 
                           cornerWhitePct < 0.03 && 
                           (avgCenterLum - avgCornerLum) > 15;

    // 2. Nano Banana Logo:
    //    - Center has yellow pixels (>= 5%)
    //    - Center has higher yellow density than corners by at least 5%
    //    - Corners have very few yellow pixels (< 2%)
    const bananaDetected = centerYellowPct > 0.05 && 
                           (centerYellowPct - cornerYellowPct) > 0.05 && 
                           cornerYellowPct < 0.02;

    if (geminiDetected) {
      return { type: "gemini" as const, score: centerWhitePct - cornerWhitePct };
    }
    if (bananaDetected) {
      return { type: "banana" as const, score: centerYellowPct - cornerYellowPct };
    }

    return null;
  };

  // Scan different sizes from 48 to 120 pixels
  const sizes = [48, 64, 80, 96, 120];

  let bestWindow: { x: number; y: number; size: number; score: number; type: "gemini" | "banana" } | null = null;

  for (const S of sizes) {
    if (S > searchWidth || S > searchHeight) continue;
    // Scan with 8px step for precise alignment
    for (let wy = 0; wy <= searchHeight - S; wy += 8) {
      // Must be within 80px of the bottom edge of the image
      const bottomMargin = height - (startY + wy + S);
      if (bottomMargin > 80) continue;

      for (let wx = 0; wx <= searchWidth - S; wx += 8) {
        // Must be within 80px of the right edge of the image
        const rightMargin = width - (startX + wx + S);
        if (rightMargin > 80) continue;

        const result = checkWindow(wx, wy, S);
        if (result) {
          if (!bestWindow || result.score > bestWindow.score) {
            bestWindow = {
              x: startX + wx,
              y: startY + wy,
              size: S,
              score: result.score,
              type: result.type
            };
          }
        }
      }
    }
  }

  if (bestWindow) {
    const winX = bestWindow.x;
    const winY = bestWindow.y;
    const S = bestWindow.size;
    const type = bestWindow.type;

    // Get the image data of the detected window
    const winImgData = ctx.getImageData(winX, winY, S, S);
    const winPixels = winImgData.data;

    // Helper to identify watermark pixels in the window
    const isWatermarkPixel = (dx: number, dy: number) => {
      const idx = (dy * S + dx) * 4;
      const r = winPixels[idx];
      const g = winPixels[idx + 1];
      const b = winPixels[idx + 2];
      const a = winPixels[idx + 3];

      if (a < 50) return false;

      const val = (r + g + b) / 3;
      const maxCh = Math.max(r, g, b);
      const minCh = Math.min(r, g, b);

      if (type === "gemini") {
        return val > 120 && (maxCh - minCh) < 30;
      } else {
        // banana
        return r > 120 && g > 120 && b < 130 && (r - b) > 35 && (g - b) > 35 && Math.abs(r - g) < 60;
      }
    };

    // BFS to find all connected components of watermark pixels starting from the center region
    const mask = Array.from({ length: S }, () => new Uint8Array(S));
    const visited = Array.from({ length: S }, () => new Uint8Array(S));
    const queue: [number, number][] = [];

    const cStart = Math.floor(S * 0.25);
    const cEnd = Math.floor(S * 0.75);

    for (let dy = cStart; dy < cEnd; dy++) {
      for (let dx = cStart; dx < cEnd; dx++) {
        if (isWatermarkPixel(dx, dy) && !visited[dy][dx]) {
          queue.push([dx, dy]);
          visited[dy][dx] = 1;
        }
      }
    }

    let head = 0;
    while (head < queue.length) {
      const [cx, cy] = queue[head++];
      mask[cy][cx] = 1;

      for (let ny = cy - 1; ny <= cy + 1; ny++) {
        for (let nx = cx - 1; nx <= cx + 1; nx++) {
          if (nx >= 0 && nx < S && ny >= 0 && ny < S) {
            if (!visited[ny][nx] && isWatermarkPixel(nx, ny)) {
              visited[ny][nx] = 1;
              queue.push([nx, ny]);
            }
          }
        }
      }
    }

    // Dilate mask by 2 pixels to completely cover anti-aliased edges
    const dilatedMask = Array.from({ length: S }, () => new Uint8Array(S));
    const dilationRadius = 2;
    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        if (mask[y][x]) {
          for (let dy = -dilationRadius; dy <= dilationRadius; dy++) {
            for (let dx = -dilationRadius; dx <= dilationRadius; dx++) {
              const ny = y + dy;
              const nx = x + dx;
              if (nx >= 0 && nx < S && ny >= 0 && ny < S) {
                dilatedMask[ny][nx] = 1;
              }
            }
          }
        }
      }
    }

    // Wavefront propagation to fill masked region with colors of surrounding unmasked pixels
    const workingPixels = new Uint8ClampedArray(winPixels);
    let maskedCount = 0;
    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        if (dilatedMask[y][x]) {
          maskedCount++;
        }
      }
    }

    let iterations = 0;
    const maxIterations = S * 2;
    while (maskedCount > 0 && iterations < maxIterations) {
      iterations++;
      const toUpdate: { x: number; y: number; r: number; g: number; b: number }[] = [];

      for (let y = 0; y < S; y++) {
        for (let x = 0; x < S; x++) {
          if (dilatedMask[y][x]) {
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
                x,
                y,
                r: Math.round(sumR / count),
                g: Math.round(sumG / count),
                b: Math.round(sumB / count)
              });
            }
          }
        }
      }

      if (toUpdate.length === 0) {
        break;
      }

      for (const item of toUpdate) {
        const idx = (item.y * S + item.x) * 4;
        workingPixels[idx] = item.r;
        workingPixels[idx + 1] = item.g;
        workingPixels[idx + 2] = item.b;
        dilatedMask[item.y][item.x] = 0;
        maskedCount--;
      }
    }

    // Copy modified pixel buffer back to canvas
    winImgData.data.set(workingPixels);
    ctx.putImageData(winImgData, winX, winY);
  }
}
