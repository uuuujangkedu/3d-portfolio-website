import { useCallback, useEffect, useRef, useState } from "react";
import { useContent } from "../context/ContentProvider";

const MAX_ANGLE = 48;
const SPRING = 0.055;
const DAMPING = 0.94;

const randomPhoto = () =>
  `https://picsum.photos/seed/${Math.random().toString(36).slice(2, 8)}/360/480`;

const clamp = (angle: number) =>
  Math.min(MAX_ANGLE, Math.max(-MAX_ANGLE, angle));

const Lanyard = () => {
  const { firstName, lastName, rolePrimary, roleSecondary, photo } =
    useContent().landing;
  const [src] = useState(() => photo || randomPhoto());
  const [broken, setBroken] = useState(false);
  const [angle, setAngle] = useState(0);
  const [grab, setGrab] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const swing = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const drag = useRef({ base: 0, from: 0, moved: 0, velocity: 0, angle: 0 });

  const apply = (value: number) => {
    drag.current.angle = value;
    setAngle(value);
  };

  // Angle of the pointer seen from the pivot at the top of the strap.
  const pointerAngle = (clientX: number, clientY: number) => {
    const box = swing.current?.getBoundingClientRect();
    if (!box) return 0;
    const dx = clientX - (box.left + box.width / 2);
    const dy = Math.max(40, clientY - box.top);
    return (Math.atan2(dx, dy) * 180) / Math.PI;
  };

  // Spring back, carrying the momentum of the throw.
  const swingBack = useCallback((velocity: number) => {
    cancelAnimationFrame(frame.current);
    drag.current.velocity = velocity;
    const tick = () => {
      const state = drag.current;
      state.velocity += -state.angle * SPRING;
      state.velocity *= DAMPING;
      state.angle += state.velocity;
      setAngle(state.angle);
      if (Math.abs(state.angle) < 0.08 && Math.abs(state.velocity) < 0.08) {
        apply(0);
        state.velocity = 0;
        return;
      }
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  // Hit tested from the card's own rectangle, so no overlay can swallow the press.
  useEffect(() => {
    const down = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const box = card.current?.getBoundingClientRect();
      if (!box) return;
      const pad = 12;
      const inside =
        event.clientX >= box.left - pad &&
        event.clientX <= box.right + pad &&
        event.clientY >= box.top - pad &&
        event.clientY <= box.bottom + pad;
      if (!inside) return;
      event.preventDefault();
      cancelAnimationFrame(frame.current);
      drag.current = {
        base: drag.current.angle,
        from: pointerAngle(event.clientX, event.clientY),
        moved: 0,
        velocity: 0,
        angle: drag.current.angle,
      };
      setGrab(true);
    };
    document.addEventListener("pointerdown", down, true);
    return () => document.removeEventListener("pointerdown", down, true);
  }, []);

  useEffect(() => {
    if (!grab) return;
    const move = (event: PointerEvent) => {
      const delta =
        pointerAngle(event.clientX, event.clientY) - drag.current.from;
      const next = clamp(drag.current.base + delta);
      drag.current.velocity = next - drag.current.angle;
      drag.current.moved +=
        Math.abs(event.movementX) + Math.abs(event.movementY);
      apply(next);
    };
    const release = () => {
      setGrab(false);
      if (drag.current.moved < 8) {
        setFlipped((value) => !value);
        apply(0);
        return;
      }
      swingBack(Math.max(-14, Math.min(14, drag.current.velocity)));
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
  }, [grab, swingBack]);

  return (
    <div className="lanyard">
      <div
        className="lanyard-swing"
        ref={swing}
        style={{ transform: `rotate(${angle}deg)` }}
      >
        <div
          className="lanyard-idle"
          style={{ animationPlayState: grab ? "paused" : "running" }}
        >
          <div className="lanyard-strap" aria-hidden />
          <span className="lanyard-clip" aria-hidden />
          <div
            ref={card}
            className={`lanyard-card${grab ? " is-grabbed" : ""}${
              flipped ? " is-flipped" : ""
            }`}
            title="Geser untuk mengayun, klik untuk membalik"
          >
            <div className="lanyard-flip">
              <div className="lanyard-face">
                {broken ? (
                  <span className="lanyard-fallback" aria-hidden>
                    {firstName.charAt(0)}
                    {lastName.charAt(0)}
                  </span>
                ) : (
                  <img
                    src={src}
                    alt=""
                    draggable={false}
                    onError={() => setBroken(true)}
                  />
                )}
                <div className="lanyard-caption">
                  <strong>{firstName}</strong>
                  <span>{lastName}</span>
                  <em>{rolePrimary}</em>
                </div>
              </div>
              <div className="lanyard-face lanyard-back">
                <span className="lanyard-back-mark">
                  {firstName.charAt(0)}
                  {lastName.charAt(0)}
                </span>
                <strong>
                  {firstName} {lastName}
                </strong>
                <span>
                  {rolePrimary} / {roleSecondary}
                </span>
                <em>Portfolio ID</em>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lanyard;