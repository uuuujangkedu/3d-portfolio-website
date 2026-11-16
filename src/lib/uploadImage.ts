import { supabase } from "./supabase";

const MAX_DIMENSION = 1200;
const MAX_DATA_URL_BYTES = 400 * 1024;

// Downscales in the browser so demo mode stays inside the localStorage quota.
async function toDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(
    1,
    MAX_DIMENSION / Math.max(bitmap.width, bitmap.height)
  );
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.82);
}

export async function uploadImage(file: File): Promise<string> {
  if (supabase) {
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-");
    const path = `${Date.now()}-${safeName}`;
    const { error } = await supabase.storage
      .from("images")
      .upload(path, file, { contentType: file.type });
    if (error) throw new Error(error.message);
    return supabase.storage.from("images").getPublicUrl(path).data.publicUrl;
  }

  const dataUrl = await toDataUrl(file);
  if (dataUrl.length > MAX_DATA_URL_BYTES) {
    throw new Error("Gambar masih terlalu besar setelah dikompres. Pakai file lain.");
  }
  return dataUrl;
}