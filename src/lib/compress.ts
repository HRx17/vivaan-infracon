// Browser-only: resize & re-encode a photo before upload (keeps uploads fast and under serverless body limits).
export async function compressImage(file: File, maxSide = 2400, quality = 0.85): Promise<File> {
  if (!file.type.startsWith("image/")) throw new Error("Not an image");
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error(`${file.name}: this format can't be read by your browser. Please export it as JPG.`);
  }
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/webp", quality));
  const out = blob && blob.type === "image/webp" ? blob : await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", quality));
  if (!out) throw new Error("Could not process image");
  const ext = out.type === "image/webp" ? "webp" : "jpg";
  return new File([out], file.name.replace(/\.[^.]+$/, "") + "." + ext, { type: out.type });
}

export async function uploadImage(file: File): Promise<string> {
  const small = await compressImage(file);
  const body = new FormData();
  body.append("file", small);
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Upload failed (${res.status})`);
  return json.url as string;
}
