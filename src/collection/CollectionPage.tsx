import { useEffect, type ReactNode } from "react";
import { useContent } from "../context/ContentProvider";
import "./collection.css";

type Props = {
  documentTitle: string;
  heading: ReactNode;
  count: string;
  children: ReactNode;
};

// Full-page listing used by projects.html and certificates.html, which have no
// landing-page scroller and therefore need their own document chrome.
const CollectionPage = ({ documentTitle, heading, count, children }: Props) => {
  const { navbar, seo } = useContent();

  useEffect(() => {
    document.documentElement.setAttribute("data-page-title", "true");
    document.title = `${documentTitle} — ${navbar.initials}`;
    return () => document.documentElement.removeAttribute("data-page-title");
  }, [documentTitle, navbar.initials]);

  return (
    <div className="collection-page">
      <header className="collection-head">
        <a href="/" className="collection-back">
          ← {navbar.initials}
        </a>
        <span>{seo.title}</span>
      </header>

      <h1>{heading}</h1>
      <p className="collection-count">{count}</p>

      {children}
    </div>
  );
};

export default CollectionPage;
