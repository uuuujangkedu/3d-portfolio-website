// Self-check: Decap drops any key missing from config.yml, so schema must mirror content.json.
// Run: node scripts/check-cms-schema.mjs
import { readFileSync } from "node:fs";
import { load } from "js-yaml";

const config = load(readFileSync("public/admin/config.yml", "utf8"));
const content = JSON.parse(readFileSync("src/data/content.json", "utf8"));

const file = config.collections[0].files[0];
const problems = [];

const walk = (data, fields, path) => {
  const names = new Set((fields ?? []).map((f) => f.name));
  if (!Array.isArray(data) && typeof data === "object" && data !== null) {
    for (const key of Object.keys(data)) {
      if (!names.has(key)) problems.push(`${path}${key} not in config.yml`);
    }
  }
  for (const field of fields ?? []) {
    const value = Array.isArray(data)
      ? data[0]?.[field.name]
      : data?.[field.name];
    if (field.fields) walk(value ?? {}, field.fields, `${path}${field.name}.`);
  }
};

walk(content, file.fields, "");

if (problems.length) {
  console.error("Schema mismatch:\n" + problems.join("\n"));
  process.exit(1);
}
console.log("config.yml covers every key in content.json");
