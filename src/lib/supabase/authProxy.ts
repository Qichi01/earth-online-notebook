const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function ensureEnv() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("MISSING_SUPABASE_ENV");
  }

  let parsed: URL;
  try {
    parsed = new URL(SUPABASE_URL);
  } catch {
    throw new Error("INVALID_SUPABASE_URL");
  }

  if (!parsed.hostname.endsWith(".supabase.co")) {
    throw new Error(`INVALID_SUPABASE_HOST:${parsed.hostname}`);
  }
}

function baseHeaders() {
  return {
    "Content-Type": "application/json",
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`
  };
}

async function safeFetchJson(url: string, payload: unknown) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(payload)
    });

    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(json?.msg || json?.error_description || `SUPABASE_HTTP_${response.status}`);
    }

    return json;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`SUPABASE_FETCH_FAILED:${error.message}`);
    }
    throw new Error("SUPABASE_FETCH_FAILED:unknown");
  }
}

export async function signInWithPassword(email: string, password: string) {
  ensureEnv();
  return safeFetchJson(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    email,
    password
  });
}

export async function signUpWithPassword(email: string, password: string, redirectTo: string) {
  ensureEnv();
  const endpoint = redirectTo
    ? `${SUPABASE_URL}/auth/v1/signup?redirect_to=${encodeURIComponent(redirectTo)}`
    : `${SUPABASE_URL}/auth/v1/signup`;

  return safeFetchJson(endpoint, {
    email,
    password,
    options: {
      emailRedirectTo: redirectTo
    },
    email_redirect_to: redirectTo
  });
}
