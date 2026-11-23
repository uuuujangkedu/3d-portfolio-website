import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { loadContent, type Content } from "../lib/content";

const ContentContext = createContext<Content | null>(null);

export const ContentProvider = ({ children }: PropsWithChildren) => {
  const [content, setContent] = useState<Content | null>(null);

  useEffect(() => {
    let alive = true;
    loadContent().then((loaded) => alive && setContent(loaded));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    // Child effects run before this one, so a page that sets its own title wins.
    if (content && !document.documentElement.hasAttribute("data-page-title")) {
      document.title = content.seo.title;
    }
  }, [content]);

  // Lets the admin dashboard drive this page inside its preview frame.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const message = event.data as { type?: string; content?: Content };
      if (message?.type === "portfolio:preview" && message.content) {
        setContent(message.content);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!content) return null;

  return (
    <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
  );
};

export const useContent = () => {
  const content = useContext(ContentContext);
  if (!content) {
    throw new Error("useContent must be used within ContentProvider");
  }
  return content;
};
