import { useEffect, useRef } from "react";
import type { Content } from "../lib/content";

// Where each section sits on the real page, so the frame jumps to it.
const anchors: Record<string, string> = {
  landing: "#landingDiv",
  about: "#about",
  career: "#career",
  work: "#work",
  certificates: "#certificates",
  techStack: "#techStack",
  contact: "#contact",
  social: "#social",
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

  useEffect(() => {
    const send = () =>
      frame.current?.contentWindow?.postMessage(
        { type: "portfolio:preview", content },
        window.location.origin
      );
    send();
    // The page boots its own content first, so repeat until it has settled.
    const timers = [700, 1800, 3200].map((ms) => window.setTimeout(send, ms));
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [content]);

  useEffect(() => {
    const target = frame.current?.contentWindow;
    if (!target) return;
    const anchor = anchors[page] ?? "";
    // Keeps the draft alive: only the hash changes, the page does not reload.
    target.location.hash = anchor;
  }, [page]);

  return (
    <aside className="ad-pane">
      <div className="ad-pane-head">
        <strong>Pratinjau</strong>
        <button type="button" onClick={onRefresh}>
          Muat ulang
        </button>
      </div>
      <iframe ref={frame} src="/" title="Pratinjau situs" />
    </aside>
  );
};

export default Preview;
