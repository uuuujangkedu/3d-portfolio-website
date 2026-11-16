import { useEffect, useRef, useState } from "react";
import { useContent } from "../context/ContentProvider";

const MAX_ANGLE = 28;

const randomPhoto = () =>
  `https://picsum.photos/seed/${Math.random().toString(36).slice(2, 8)}/360/480`;

const clamp = (angle: number) =>
  Math.min(MAX_ANGLE, Math.max(-MAX_ANGLE, angle));

const Lanyard = () => {
  const { firstName, lastName, rolePrimary, photo } = useContent().landing;
  const [src] = useState(() => photo || randomPhoto());
  const [broken, setBroken] = useState(false);
  const [angle, setAngle] = useState(0);
  const [grab, setGrab] = useState(false);
  const swing = useRef<HTMLDivElement>(null);
  const drag = useRef({ base: 0, from: 0 });

  // Angle of the pointer seen from the pivot at the top of the strap.
  const pointerAngle = (clientX: number, clientY: number) => {
    const box = swing.current?.getBoundingClientRect();
    if (!box) return 0;
    const dx = clientX - (box.left + box.width / 2);
    const dy = Math.max(40, clientY - box.top);
    return (Math.atan2(dx, dy) * 180) / Math.PI;
  };

  // Track on the window, so the drag survives leaving the card.
  useEffect(() => {
    if (!grab) return;
    const move = (event: PointerEvent) => {
      const delta = pointerAngle(event.clientX, event.clientY) - drag.current.from;
      setAngle(clamp(drag.current.base + delta));
    };
    const release = () => {
      setGrab(false);
      setAngle(0);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
  }, [grab]);

  return (
    <div
      className="lanyard"
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        drag.current = {
          base: angle,
          from: pointerAngle(event.clientX, event.clientY),
        };
        setGrab(true);
      }}
    >
      <div
        className="lanyard-swing"
        ref={swing}
        style={{
          transform: `rotate(${angle}deg)`,
          transition: grab ? "none" : undefined,
        }}
      >
        <div
          className="lanyard-idle"
          style={{ animationPlayState: grab ? "paused" : "running" }}
        >
          <div className="lanyard-strap" aria-hidden />
          <span className="lanyard-clip" aria-hidden />
          <div className={`lanyard-card${grab ? " is-grabbed" : ""}`}>
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
        </div>
      </div>
    </div>
  );
};

export default Lanyard;