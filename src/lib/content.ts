import fallback from "../data/content.json";
import { supabase } from "./supabase";

// Lists start empty in content.json, which TypeScript would infer as never[].
export type Certificate = {
  title: string;
  issuer: string;
  year: string;
  image: string;
  url: string;
};

export type Skill = {
  name: string;
  level: string;
  description: string;
};

export type Content = Omit<typeof fallback, "certificates" | "skills"> & {
  certificates: Certificate[];
  skills: {
    title: string;
    items: Skill[];
  };
};

const OVERRIDE_KEY = "portfolio:content";
const ROW_ID = "main";

// Reads the Supabase row when configured, otherwise a browser-local override,
// otherwise the content.json bundled at build time.
export async function loadContent(): Promise<Content> {
  if (supabase) {
    const { data, error } = await supabase
      .from("site_content")
      .select("data")
      .eq("id", ROW_ID)
      .maybeSingle();
    if (error) {
      console.error("Supabase read failed, using bundled content:", error.message);
    } else if (data?.data) {
      return data.data as Content;
    }
    return fallback as Content;
  }

  const local = localStorage.getItem(OVERRIDE_KEY);
  return local ? (JSON.parse(local) as Content) : (fallback as Content);
}

export async function saveContent(next: Content): Promise<void> {
  if (supabase) {
    const { error } = await supabase
      .from("site_content")
      .upsert({ id: ROW_ID, data: next, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return;
  }
  localStorage.setItem(OVERRIDE_KEY, JSON.stringify(next));
}

export async function resetContent(): Promise<Content> {
  if (supabase) {
    const { error } = await supabase.from("site_content").delete().eq("id", ROW_ID);
    if (error) throw new Error(error.message);
  } else {
    localStorage.removeItem(OVERRIDE_KEY);
  }
  return loadContent();
}
