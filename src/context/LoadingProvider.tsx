import { createContext, PropsWithChildren, useContext, useState } from "react";
import Loading from "../components/Loading";
import { isFramed } from "../lib/embed";

interface LoadingType {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  setLoading: (percent: number) => void;
}

export const LoadingContext = createContext<LoadingType | null>(null);

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  // Inside the admin preview frame the loader is skipped: it would hide the
  // page for seconds and keep the smoother paused. Navbar runs the entrance FX
  // instead, once it has created the smoother.
  const [embedded] = useState(isFramed);
  const [isLoading, setIsLoading] = useState(!embedded);
  const [loading, setLoading] = useState(0);

  const value = {
    isLoading,
    setIsLoading,
    setLoading,
  };

  return (
    <LoadingContext.Provider value={value as LoadingType}>
      {isLoading && <Loading percent={loading} />}
      <main className="main-body">{children}</main>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
