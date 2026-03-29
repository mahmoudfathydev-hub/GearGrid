"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const theme = store.getState().theme.theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
