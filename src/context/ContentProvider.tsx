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
    if (content) document.title = content.seo.title;
  }, [content]);

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
