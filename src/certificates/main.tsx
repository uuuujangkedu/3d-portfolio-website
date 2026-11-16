import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ContentProvider } from "../context/ContentProvider";
import AllCertificates from "./AllCertificates";
import "../index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ContentProvider>
      <AllCertificates />
    </ContentProvider>
  </StrictMode>
);
