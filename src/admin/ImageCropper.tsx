import { useEffect, useRef, useState } from "react";
import { identityEdit } from "../lib/editFrame";
import type { ImageEdit } from "../lib/editFrame";
import { drawEdit, uploadImage } from "../lib/uploadImage";

type Props = {
  file: File;
  onDone: (url: string) => void;
  onCancel: () => void;
};

const clamp = (value: number, limit: number) =>
  Math.min(limit, Math.max(-limit, value));

// Frames the picked file before it is stored: rotate, zoom and pan are drawn
// straight into the canvas, so what the admin sees is what gets saved.
const ImageCropper = ({ file, onDone, onCancel }: Props) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const bitmap = useRef<ImageBitmap | null>(null);
  const travel = useRef<{ x: number; y: number } | null>(null);
  const [edit, setEdit] = useState<ImageEdit>(identityEdit);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    createImageBitmap(file).then((image) => {
      if (!alive) {
        image.close();
        return;
      }
      bitmap.current = image;
      setReady(true);
    });
    return () => {
      alive = false;
      bitmap.current?.close();
      bitmap.current = null;
    };
  }, [file]);

  useEffect(() => {
    if (ready && bitmap.current && canvas.current) {
      drawEdit(canvas.current, bitmap.current, edit);
    }
  }, [ready, edit]);

  const zoom = (value: number) =>
    setEdit((state) => ({
      ...state,
      zoom: value,
      x: clamp(state.x, value - 1),
      y: clamp(state.y, value - 1),
    }));

  const turn = (step: number) =>
    setEdit((state) => ({ ...state, rotate: state.rotate + step }));

  const grab = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (edit.zoom <= 1) return;
    travel.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const from = travel.current;
    const box = canvas.current;
    if (!from || !box) return;
    const limit = edit.zoom - 1;
    travel.current = { x: event.clientX, y: event.clientY };
    setEdit((state) => ({
      ...state,
      x: clamp(state.x + (2 * (event.clientX - from.x)) / box.width, limit),
      y: clamp(state.y + (2 * (event.clientY - from.y)) / box.height, limit),
    }));
  };

  const drop = () => {
    travel.current = null;
  };

  const save = async () => {
    setBusy(true);
    setError("");
    try {
      onDone(await uploadImage(file, edit));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setBusy(false);
    }
  };

  return (
    <div className="ad-field ad-crop">
      <span>Atur foto</span>
      <canvas
        ref={canvas}
        onPointerDown={grab}
        onPointerMove={move}
        onPointerUp={drop}
        onPointerCancel={drop}
        style={{ cursor: edit.zoom > 1 ? "move" : "default" }}
      />
      <span className="ad-crop-hint">
        Perbesar lalu geser untuk memilih bagian foto.
      </span>
      <div className="ad-row">
        <label className="ad-crop-zoom">
          Zoom
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={edit.zoom}
            onChange={(e) => zoom(Number(e.target.value))}
          />
        </label>
        <button type="button" onClick={() => turn(-90)}>
          Putar kiri
        </button>
        <button type="button" onClick={() => turn(90)}>
          Putar kanan
        </button>
        <button type="button" onClick={() => setEdit(identityEdit())}>
          Reset
        </button>
      </div>
      <div className="ad-row">
        <button type="button" className="ad-primary" disabled={busy} onClick={save}>
          {busy ? "Menyimpan..." : "Simpan foto"}
        </button>
        <button type="button" disabled={busy} onClick={onCancel}>
          Batal
        </button>
      </div>
      {error ? <span className="ad-field-error">{error}</span> : null}
    </div>
  );
};

export default ImageCropper;
