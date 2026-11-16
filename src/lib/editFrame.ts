// Framing chosen in the cropper: clockwise degrees, zoom above 1 and a pan of
// up to (zoom - 1) half-widths to each side.
export type ImageEdit = { rotate: number; zoom: number; x: number; y: number };

export const identityEdit = (): ImageEdit => ({
  rotate: 0,
  zoom: 1,
  x: 0,
  y: 0,
});

const fit = (value: number, limit: number) =>
  Math.min(limit, Math.max(-limit, value));

// The frame is the rotated bounding box of the source, so a quarter turn swaps
// its sides; pan can never exceed the overflow, which is what keeps the canvas
// fully covered.
export const editFrame = (
  width: number,
  height: number,
  edit: ImageEdit,
  max: number
) => {
  const rad = (edit.rotate * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));
  const boxWidth = width * cos + height * sin;
  const boxHeight = width * sin + height * cos;
  const scale = Math.min(1, max / Math.max(boxWidth, boxHeight));
  const zoom = Math.max(1, edit.zoom);
  const limit = zoom - 1;

  return {
    rad,
    scale,
    zoom,
    width: Math.max(1, Math.round(boxWidth * scale)),
    height: Math.max(1, Math.round(boxHeight * scale)),
    x: fit(edit.x, limit),
    y: fit(edit.y, limit),
  };
};
