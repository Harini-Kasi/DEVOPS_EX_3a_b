import { useCallback, useState } from "react";

/**
 * Small helper hook that keeps a piece of state in sync with
 * localStorage. Used by ThemeContext for the Settings page
 * (theme + font size persistence).
 */
export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored !== null ? stored : defaultValue;
  });

  const setAndStore = useCallback(
    (newValue) => {
      setValue(newValue);
      localStorage.setItem(key, newValue);
    },
    [key]
  );

  return [value, setAndStore];
}
