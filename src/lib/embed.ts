// True when the site runs inside another page — the admin dashboard preview
// frame. There the loader is skipped so the preview shows the page at once.
export const isFramed = () => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
};
