import { supabase } from "./supabase";
import { editFrame, identityEdit } from "./editFrame";
import type { ImageEdit } from "./editFrame";

export type { ImageEdit } from "./editFrame";
export { identityEdit } from "./editFrame";

const MAX_DIMENSION = 1200;
const MAX_DATA_URL_BYTES = 400 * 1024;

export const drawEdit = (
  canvas: HTMLCanvasElement,
  image: ImageBitmap,
  edit: ImageEdit
) => {
  const frame = editFrame(image.width, image.height, edit, MAX_DIMENSION);
  canvas.width = frame.width;
  canvas.height = frame.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#0a0e17";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.translate(
    canvas.width / 2 + (frame.x * canvas.width) / 2,
    canvas.height / 2 + (frame.y * canvas.height) / 2
  );
  ctx.rotate(frame.rad);
  ctx.scale(frame.zoom, frame.zoom);
  ctx.drawImage(
    image,
    (-image.width * frame.scale) / 2,
    (-image.height * frame.scale) / 2,
    image.width * frame.scale,
    image.height * frame.scale
  );
};

const toBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Gagal memproses gambar."))),
      "image/jpeg",
      0.82
    )
  );

export async function uploadImage(
  file: File,
  edit: ImageEdit = identityEdit()
): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  drawEdit(canvas, bitmap, edit);
  bitmap.close();

  if (supabase) {
    const base =
      file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9.-]/g, "-") || "foto";
    const path = `${Date.now()}-${base}.jpg`;
    const { error } = await supabase.storage
      .from("images")
      .upload(path, await toBlob(canvas), { contentType: "image/jpeg" });
    if (error) throw new Error(error.message);
    return supabase.storage.from("images").getPublicUrl(path).data.publicUrl;
  }

  // Demo mode keeps the image in localStorage, so it has to stay small.
  const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
  if (dataUrl.length > MAX_DATA_URL_BYTES) {
    throw new Error(
      "Gambar masih terlalu besar setelah dikompres. Coba perkecil zoom atau pakai file lain."
    );
  }
  return dataUrl;
}
