import React, { createContext, useState, useEffect, useCallback } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check if user has a saved preference
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      return JSON.parse(saved);
    }
    
    // If no saved preference, check system preference
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    // Default to light mode
    return false;
  });

  const toggleDarkMode = useCallback(() => {
    console.log("🔍 ThemeProvider - toggleDarkMode called, current darkMode:", darkMode);
    setDarkMode((prev) => {
      const newValue = !prev;
      console.log("🔍 ThemeProvider - Setting darkMode to:", newValue);
      return newValue;
    });
  }, [darkMode]);

  useEffect(() => {
    console.log("🔍 ThemeProvider - useEffect triggered, darkMode:", darkMode);
    console.log("🔍 ThemeProvider - document.documentElement.classList before:", document.documentElement.classList.toString());
    
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      console.log("🔍 ThemeProvider - Added 'dark' class, removed 'light' class");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      console.log("🔍 ThemeProvider - Removed 'dark' class, added 'light' class");
    }
    
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    console.log("🔍 ThemeProvider - Saved to localStorage:", darkMode);
    console.log("🔍 ThemeProvider - document.documentElement.classList after:", document.documentElement.classList.toString());
    
    // Check computed styles
    const computedStyle = window.getComputedStyle(document.documentElement);
    console.log("🔍 ThemeProvider - Computed background color:", computedStyle.backgroundColor);
  }, [darkMode]);

  console.log("🔍 ThemeProvider - Rendering with darkMode:", darkMode);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};