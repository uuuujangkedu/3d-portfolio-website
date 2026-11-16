import assert from "node:assert/strict";
import { editFrame } from "../src/lib/editFrame.ts";

const full = editFrame(400, 300, { rotate: 0, zoom: 1, x: 0.5, y: 0.5 }, 1200);
assert.deepEqual([full.width, full.height], [400, 300], "keeps the source size");
assert.equal(full.x, 0, "no pan before zooming in");

const turned = editFrame(400, 300, { rotate: 90, zoom: 1, x: 0, y: 0 }, 1200);
assert.deepEqual([turned.width, turned.height], [300, 400], "swaps sides");

const zoomed = editFrame(400, 300, { rotate: 0, zoom: 2, x: 9, y: -9 }, 1200);
assert.deepEqual([zoomed.width, zoomed.height], [400, 300], "crops, never grows");
assert.deepEqual([zoomed.x, zoomed.y], [1, -1], "clamps the pan to the overflow");

const capped = editFrame(4000, 3000, { rotate: 0, zoom: 1, x: 0, y: 0 }, 1200);
assert.deepEqual([capped.width, capped.height], [1200, 900], "caps the long side");

console.log("editFrame ok");
