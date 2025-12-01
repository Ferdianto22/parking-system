import { useState } from "react";
import { StorageService } from "@/services";

/**
 * Hook for managing localStorage with React state
 * @param key - localStorage key
 * @param initialValue - default value if key doesn't exist
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return StorageService.get<T>(key, initialValue);
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      StorageService.set(key, valueToStore);
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}
