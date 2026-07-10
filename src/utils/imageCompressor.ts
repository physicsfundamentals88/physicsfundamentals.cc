/**
 * Image compressor utility.
 * Always converts uploaded images to WebP format at 0.92 quality (compression).
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

        // ALWAYS compress and convert to WebP at 0.92 quality
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
