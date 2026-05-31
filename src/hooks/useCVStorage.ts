import { useCallback, useEffect, useRef, useState } from "react";
import { emptyCV, loadCVData, sampleCV, STORAGE_KEY, type CVData } from "@/data/sampleCV";

const DEBOUNCE_MS = 500;

export type SaveStatus = "idle" | "saving" | "saved";

export function useCVStorage() {
  const [data, setDataState] = useState<CVData>(sampleCV);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const isHydrating = useRef(true);

  useEffect(() => {
    setDataState(loadCVData());
    try {
      if (localStorage.getItem(STORAGE_KEY)) {
        setLastSaved(new Date());
      }
    } catch {
      // localStorage unavailable
    }
    isHydrating.current = false;
  }, []);

  useEffect(() => {
    if (isHydrating.current) return;

    setSaveStatus("saving");
    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setSaveStatus("saved");
        setLastSaved(new Date());
      } catch {
        setSaveStatus("idle");
      }
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [data]);

  const setData = useCallback((next: CVData | ((prev: CVData) => CVData)) => {
    setDataState(next);
  }, []);

  const resetData = useCallback(() => {
    setDataState(emptyCV);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(emptyCV));
      setSaveStatus("saved");
      setLastSaved(new Date());
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setSaveStatus("idle");
    }
  }, []);

  return { data, setData, saveStatus, lastSaved, resetData };
}
