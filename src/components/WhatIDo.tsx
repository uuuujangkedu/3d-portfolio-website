import { useEffect, useRef } from "react";
import "./styles/WhatIDo.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useContent } from "../context/ContentProvider";

const WhatIDo = () => {
  const { whatIDo } = useContent();
  const containerRef = useRef<(HTMLDivElement | null)[]>([]);
  const setRef = (el: HTMLDivElement | null, index: number) => {
    containerRef.current[index] = el;
  };
  useEffect(() => {
    if (!ScrollTrigger.isTouch) return;
    // One handler per card, kept so cleanup can actually remove it. A fresh
    // closure in cleanup (or a second StrictMode mount) left the listener
    // attached twice, so each tap toggled the card open *and* closed again.
    const bound = containerRef.current.flatMap((container) => {
      if (!container) return [];
      container.classList.remove("what-noTouch");
      const handler = () => handleClick(container);
      container.addEventListener("click", handler);
      return [{ container, handler }];
    });
    return () => {
      bound.forEach(({ container, handler }) =>
        container.removeEventListener("click", handler)
      );
    };
  }, []);
  return (
    <div className="whatIDO">
      <div className="what-box">
        <h2 className="title">
          W<span className="hat-h2">HAT</span>
          <div>
            I<span className="do-h2"> DO</span>
          </div>
        </h2>
      </div>
      <div className="what-box">
        <div className="what-box-in">
          <div className="what-border2">
            <svg width="100%">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
              <line
                x1="100%"
                y1="0"
                x2="100%"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
            </svg>
          </div>
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 0)}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>

            <div className="what-content-in">
              <h3>{whatIDo[0].title}</h3>
              <h4>{whatIDo[0].subtitle}</h4>
              <p>{whatIDo[0].description}</p>
              <h5>Skillset & tools</h5>
              <div className="what-content-flex">
                {whatIDo[0].tags.map((tag) => (
                  <div className="what-tags" key={tag}>
                    {tag}
                  </div>
                ))}
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 1)}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>
            <div className="what-content-in">
              <h3>{whatIDo[1].title}</h3>
              <h4>{whatIDo[1].subtitle}</h4>
              <p>{whatIDo[1].description}</p>
              <h5>Skillset & tools</h5>
              <div className="what-content-flex">
                {whatIDo[1].tags.map((tag) => (
                  <div className="what-tags" key={tag}>
                    {tag}
                  </div>
                ))}
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;

function handleClick(container: HTMLDivElement) {
  container.classList.toggle("what-content-active");
  container.classList.remove("what-sibling");
  if (container.parentElement) {
    const siblings = Array.from(container.parentElement.children);

    siblings.forEach((sibling) => {
      if (sibling !== container) {
        sibling.classList.remove("what-content-active");
        sibling.classList.toggle("what-sibling");
      }
    });
  }
}
