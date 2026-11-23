import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { ALLOWED_IMAGE_TYPES, saveImage } from "@/lib/storage";

export const runtime = "nodejs";
const MAX_BYTES = 4 * 1024 * 1024; // photos are resized in the browser first; stays under Vercel's 4.5 MB body limit

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return NextResponse.json({ error: "Use JPG, PNG, WebP or AVIF." }, { status: 415 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Image is too large (max 4 MB after resizing)." }, { status: 413 });
  try {
    const url = await saveImage(file);
    return NextResponse.json({ url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
