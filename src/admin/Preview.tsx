import { useCallback, useEffect, useRef } from "react";
import type { Content } from "../lib/content";

// Where each admin section actually lives: the real page to load, and the
// element to scroll to once it is up. Project and Certificates have their own
// full pages; everything else is a section of the landing page.
const targets: Record<string, { src: string; anchor?: string }> = {
  landing: { src: "/", anchor: "#landingDiv" },
  about: { src: "/", anchor: "#about" },
  whatIDo: { src: "/", anchor: ".whatIDO" },
  career: { src: "/", anchor: ".career-section" },
  work: { src: "/projects.html" },
  certificates: { src: "/certificates.html" },
  skills: { src: "/", anchor: "#skills" },
  techStack: { src: "/", anchor: ".techstack" },
  contact: { src: "/", anchor: "#contact" },
  social: { src: "/", anchor: "#social" },
};

type Props = {
  page: string;
  content: Content;
  onRefresh: () => void;
};

// The real site in a frame: the draft is posted into it, so edits show up
// before they are saved. Same origin, so the frame can be driven directly.
const Preview = ({ page, content, onRefresh }: Props) => {
  const frame = useRef<HTMLIFrameElement>(null);
  const { src, anchor } = targets[page] ?? { src: "/" };

  const send = useCallback(() => {
    const target = frame.current?.contentWindow;
    if (!target) return;
    target.postMessage(
      { type: "portfolio:preview", content },
      window.location.origin
    );
    if (anchor) {
      target.postMessage(
        { type: "portfolio:preview-anchor", anchor },
        window.location.origin
      );
    }
  }, [content, anchor]);

  useEffect(() => {
    send();
    // The page boots its own content first, so repeat until it has settled.
    const timers = [700, 1800, 3200].map((ms) => window.setTimeout(send, ms));
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [send]);

  return (
    <aside className="ad-pane">
      <div className="ad-pane-head">
        <strong>Pratinjau</strong>
        <button type="button" onClick={onRefresh}>
          Muat ulang
        </button>
      </div>
      <iframe
        ref={frame}
        src={src}
        title="Pratinjau situs"
        onLoad={send}
      />
    </aside>
  );
};

export default Preview;
