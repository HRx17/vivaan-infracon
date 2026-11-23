// Edge- and Node-compatible signed session token (used by middleware and server code).
export const SESSION_COOKIE = "vi_admin";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function secret() {
  const s = process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD;
  if (!s) return null;
  return s;
}

async function hmac(data: string, key: string) {
  const enc = new TextEncoder();
  const k = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", k, enc.encode(data));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function createSessionToken() {
  const key = secret();
  if (!key) throw new Error("ADMIN_PASSWORD / AUTH_SECRET not configured");
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  return `${exp}.${await hmac(`admin.${exp}`, key)}`;
}

export async function verifySessionToken(token: string | undefined | null) {
  const key = secret();
  if (!key || !token) return false;
  const [expStr, sig] = token.split(".");
  const exp = Number(expStr);
  if (!exp || !sig || exp < Date.now() / 1000) return false;
  return safeEqual(sig, await hmac(`admin.${exp}`, key));
}

export async function checkPassword(input: string) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  // compare digests so timing doesn't leak length
  const k = "pw-compare";
  return safeEqual(await hmac(input, k), await hmac(pw, k));
}
