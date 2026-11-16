import { supabase, isRemote } from "../lib/supabase";

const SESSION_KEY = "portfolio:admin-session";
const demoEmail = (import.meta.env.VITE_DEMO_ADMIN_EMAIL as string) || "admin@local";
const demoPassword = (import.meta.env.VITE_DEMO_ADMIN_PASSWORD as string) || "admin";

// ponytail: with no Supabase project this is a UI gate, not security — the
// "password" below ships to every browser. Real protection needs Supabase Auth.
export const demoMode = !isRemote();

// Shown on the login page so the demo is usable. Safe only because demo mode has
// no real authentication behind it.
export const demoCredentials = { email: demoEmail, password: demoPassword };

export async function signIn(email: string, password: string): Promise<void> {
  if (!supabase) {
    const ok =
      email.trim().toLowerCase() === demoEmail && password === demoPassword;
    if (!ok) throw new Error("Email atau password salah (mode demo).");
    sessionStorage.setItem(SESSION_KEY, "1");
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
}

export async function signOut(): Promise<void> {
  sessionStorage.removeItem(SESSION_KEY);
  await supabase?.auth.signOut();
}

export async function hasSession(): Promise<boolean> {
  if (!supabase) return sessionStorage.getItem(SESSION_KEY) === "1";
  const { data } = await supabase.auth.getSession();
  return data.session !== null;
}

export async function currentEmail(): Promise<string> {
  if (!supabase) return demoEmail;
  const { data } = await supabase.auth.getUser();
  return data.user?.email ?? "";
}
