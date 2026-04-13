import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "auto");

  useEffect(() => {
    const root = document.documentElement;
    const apply = (dark) => {
      if (dark) root.classList.add("dark");
      else root.classList.remove("dark");
    };

    if (theme === "dark") {
      apply(true);
    } else if (theme === "light") {
      apply(false);
    } else {
      // auto — follow system
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      apply(mq.matches);
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Re-apply when system preference changes (auto mode only)
  useEffect(() => {
    if (theme !== "auto") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      if (e.matches) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
