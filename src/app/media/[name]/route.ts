import { readLocalUpload } from "@/lib/storage";

export const runtime = "nodejs";

// Serves photos uploaded with the local disk driver (./data/uploads).
export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const file = await readLocalUpload((await params).name);
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(file.data), {
    headers: { "Content-Type": file.type, "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
