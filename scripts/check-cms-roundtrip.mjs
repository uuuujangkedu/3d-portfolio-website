// Self-check: round-trips content.json through the Decap local proxy.
// Catches config.yml schema drift, which silently drops keys on save.
// Run: npm run cms  (then)  node scripts/check-cms-roundtrip.mjs
import { readFileSync } from "node:fs";

const raw = readFileSync("src/data/content.json", "utf8");
const proxy = "http://localhost:8081/api/v1";

const info = await fetch(proxy, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ action: "info", params: {} }),
}).then((r) => r.json());
console.log("proxy info:", info);

const res = await fetch(proxy, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    action: "persistEntry",
    params: {
      branch: "main",
      entry: { path: "src/data/content.json", raw, slug: "site" },
      assets: [],
      options: {
        collectionName: "content",
        commitMessage: "roundtrip check",
        useWorkflow: false,
        status: "draft",
      },
    },
  }),
}).then((r) => r.json());
console.log("persistEntry:", res);

const after = JSON.parse(readFileSync("src/data/content.json", "utf8"));
const before = JSON.parse(raw);
const { isDeepStrictEqual } = await import("node:util");
if (!isDeepStrictEqual(after, before)) {
  console.error("Round trip changed the data — check config.yml fields.");
  process.exit(1);
}
console.log("round trip preserved every key and value");
