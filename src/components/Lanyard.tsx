import { useCallback, useEffect, useRef, useState } from "react";
import { useContent } from "../context/ContentProvider";
import { useLoading } from "../context/LoadingProvider";

const MAX_ANGLE = 48;
const MIN_STRETCH = -30;
const MAX_STRETCH = 170;
const SPRING = 0.06;
const DAMPING = 0.93;

const randomPhoto = () =>
  `https://picsum.photos/seed/${Math.random().toString(36).slice(2, 8)}/360/480`;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

// Matches the resting strap height, so stretching keeps it joined to the clip.
const strapBase = () => {
  const height = window.innerHeight || 800;
  return clamp(height * 0.07, 46, 110);
};

const Lanyard = () => {
  const { firstName, lastName, rolePrimary, roleSecondary, photo } =
    useContent().landing;
  const { isLoading } = useLoading();
  const [src] = useState(() => photo || randomPhoto());
  const [broken, setBroken] = useState(false);
  const [pose, setPose] = useState({ angle: 0, stretch: 0 });
  const [grab, setGrab] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const swing = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const motion = useRef({
    angle: 0,
    stretch: 0,
    angleVelocity: 0,
    stretchVelocity: 0,
  });
  const drag = useRef({ angle: 0, stretch: 0, from: 0, y: 0, moved: 0 });

  const paint = useCallback((angle: number, stretch: number) => {
    motion.current.angle = angle;
    motion.current.stretch = stretch;
    setPose({ angle, stretch });
  }, []);

  // Angle of the pointer seen from the pivot at the top of the strap.
  const pointerAngle = (clientX: number, clientY: number) => {
    const box = swing.current?.getBoundingClientRect();
    if (!box) return 0;
    const dx = clientX - (box.left + box.width / 2);
    const dy = Math.max(40, clientY - box.top);
    // Negated: a CSS rotation turns clockwise, which would move a hanging card
    // the opposite way to the pointer.
    return (-Math.atan2(dx, dy) * 180) / Math.PI;
  };

  // Spring back to hanging, keeping the momentum of the throw.
  const settle = useCallback(
    (angleVelocity: number, stretchVelocity: number) => {
      cancelAnimationFrame(frame.current);
      motion.current.angleVelocity = angleVelocity;
      motion.current.stretchVelocity = stretchVelocity;
      const tick = () => {
        const state = motion.current;
        state.angleVelocity += -state.angle * SPRING;
        state.stretchVelocity += -state.stretch * SPRING;
        state.angleVelocity *= DAMPING;
        state.stretchVelocity *= DAMPING;
        state.angle += state.angleVelocity;
        state.stretch += state.stretchVelocity;
        setPose({ angle: state.angle, stretch: state.stretch });
        const calm =
          Math.abs(state.angle) < 0.08 &&
          Math.abs(state.stretch) < 0.08 &&
          Math.abs(state.angleVelocity) < 0.08 &&
          Math.abs(state.stretchVelocity) < 0.08;
        if (calm) {
          motion.current = {
            angle: 0,
            stretch: 0,
            angleVelocity: 0,
            stretchVelocity: 0,
          };
          setPose({ angle: 0, stretch: 0 });
          return;
        }
        frame.current = requestAnimationFrame(tick);
      };
      frame.current = requestAnimationFrame(tick);
    },
    []
  );

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  // Entrance: drop out of the loader and wobble itself still.
  const entered = useRef(false);
  useEffect(() => {
    if (isLoading || entered.current) return;
    entered.current = true;
    const timer = window.setTimeout(() => {
      paint(-22, 34);
      settle(0, 0);
    }, 180);
    return () => window.clearTimeout(timer);
  }, [isLoading, paint, settle]);

  // Hit tested from the card's own box, so no overlay can swallow the press.
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
        angle: motion.current.angle,
        stretch: motion.current.stretch,
        from: pointerAngle(event.clientX, event.clientY),
        y: event.clientY,
        moved: 0,
      };
      setGrab(true);
    };
    document.addEventListener("pointerdown", down, true);
    return () => document.removeEventListener("pointerdown", down, true);
  }, []);

  useEffect(() => {
    if (!grab) return;
    let lastAngle = motion.current.angle;
    let lastStretch = motion.current.stretch;
    const move = (event: PointerEvent) => {
      const delta =
        pointerAngle(event.clientX, event.clientY) - drag.current.from;
      const angle = clamp(
        drag.current.angle + delta,
        -MAX_ANGLE,
        MAX_ANGLE
      );
      const stretch = clamp(
        drag.current.stretch + (event.clientY - drag.current.y),
        MIN_STRETCH,
        MAX_STRETCH
      );
      motion.current.angleVelocity = angle - lastAngle;
      motion.current.stretchVelocity = stretch - lastStretch;
      lastAngle = angle;
      lastStretch = stretch;
      drag.current.moved +=
        Math.abs(event.movementX) + Math.abs(event.movementY);
      paint(angle, stretch);
    };
    const release = () => {
      setGrab(false);
      if (drag.current.moved < 8) {
        setFlipped((value) => !value);
        settle(0, 0);
        return;
      }
      settle(
        clamp(motion.current.angleVelocity, -14, 14),
        clamp(motion.current.stretchVelocity, -14, 14)
      );
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
  }, [grab, paint, settle]);

  const strapHeight = Math.max(22, strapBase() + pose.stretch);

  return (
    <div className="lanyard">
      <div
        className="lanyard-swing"
        ref={swing}
        style={{ transform: `rotate(${pose.angle}deg)` }}
      >
        <div
          className="lanyard-idle"
          style={{ animationPlayState: grab ? "paused" : "running" }}
        >
          <div
            className="lanyard-strap"
            aria-hidden
            style={{ height: `${strapHeight}px` }}
          >
            <span className="lanyard-band left" />
            <span className="lanyard-band right" />
          </div>
          <div className="lanyard-hang">
            <span className="lanyard-clip" aria-hidden />
            <div
              ref={card}
              className={`lanyard-card${grab ? " is-grabbed" : ""}${
                flipped ? " is-flipped" : ""
              }`}
              style={{
                transform: `rotate(${pose.angle * -0.12}deg) scale(${
                  grab ? 1.03 : 1
                })`,
              }}
              title="Tarik ke mana saja, klik untuk membalik"
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
    </div>
  );
};

export default Lanyard;