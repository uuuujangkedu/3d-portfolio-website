import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ContentProvider } from "../context/ContentProvider";
import AllProjects from "./AllProjects";
import "../index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ContentProvider>
      <AllProjects />
    </ContentProvider>
  </StrictMode>
);
