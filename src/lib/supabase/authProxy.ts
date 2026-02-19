const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function ensureEnv() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("MISSING_SUPABASE_ENV");
  }
}

function baseHeaders() {
  return {
    "Content-Type": "application/json",
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`
  };
}

export async function signInWithPassword(email: string, password: string) {
  ensureEnv();
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: baseHeaders(),
    body: JSON.stringify({ email, password })
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(json?.msg || json?.error_description || "LOGIN_FAILED");
  }
  return json;
}

export async function signUpWithPassword(email: string, password: string, redirectTo: string) {
  ensureEnv();
  const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: baseHeaders(),
    body: JSON.stringify({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo
      }
    })
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(json?.msg || json?.error_description || "REGISTER_FAILED");
  }
  return json;
}
