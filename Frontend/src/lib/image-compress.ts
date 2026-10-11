// src/lib/image-compress.ts
//
// Shrinks a picked image in the browser before it is sent to the API. Banner
// images travel inside the JSON request, and production web servers reject
// large request bodies (HTTP 413), so a photo straight off a camera or out of
// a design tool has to be resized and re-encoded first.

export interface CompressOptions {
  /** Longest allowed width / height in pixels; the image is scaled down to fit. */
  maxWidth: number;
  maxHeight: number;
  /** Target size of the encoded image, in bytes. */
  maxBytes: number;
}

export interface CompressedImage {
  dataUrl: string;
  bytes: number;
  width: number;
  height: number;
}

const QUALITY_STEPS = [0.86, 0.78, 0.7, 0.6, 0.5];
// If lowering quality is not enough, shrink the picture and try again.
const SHRINK_FACTOR = 0.85;
const MAX_SHRINK_ROUNDS = 6;

const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("This file could not be read as an image"));
    };
    image.src = url;
  });

const toBlob = (canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> =>
  new Promise((resolve) => canvas.toBlob(resolve, type, quality));

const toDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("The image could not be processed"));
    reader.readAsDataURL(blob);
  });

const draw = (image: HTMLImageElement, width: number, height: number, opaque: boolean) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("The image could not be processed");

  // JPEG has no transparency; without a backdrop, clear areas turn black.
  if (opaque) {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
  }
  context.imageSmoothingQuality = "high";
  context.drawImage(image, 0, 0, width, height);
  return canvas;
};

export async function compressImage(file: File, options: CompressOptions): Promise<CompressedImage> {
  const image = await loadImage(file);

  const fit = Math.min(1, options.maxWidth / image.naturalWidth, options.maxHeight / image.naturalHeight);
  let width = Math.max(1, Math.round(image.naturalWidth * fit));
  let height = Math.max(1, Math.round(image.naturalHeight * fit));

  // WebP is markedly smaller at the same quality; fall back to JPEG where the
  // browser cannot encode it (toBlob then hands back a PNG instead).
  const probe = await toBlob(draw(image, 1, 1, false), "image/webp", 0.8);
  const type = probe?.type === "image/webp" ? "image/webp" : "image/jpeg";

  let best: Blob | null = null;

  for (let round = 0; round <= MAX_SHRINK_ROUNDS; round++) {
    const canvas = draw(image, width, height, type === "image/jpeg");

    for (const quality of QUALITY_STEPS) {
      const blob = await toBlob(canvas, type, quality);
      if (!blob) continue;
      best = blob;
      if (blob.size <= options.maxBytes) {
        return { dataUrl: await toDataUrl(blob), bytes: blob.size, width, height };
      }
    }

    width = Math.max(1, Math.round(width * SHRINK_FACTOR));
    height = Math.max(1, Math.round(height * SHRINK_FACTOR));
  }

  if (!best) throw new Error("The image could not be processed");
  return { dataUrl: await toDataUrl(best), bytes: best.size, width, height };
}

export const formatBytes = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
