import { useCallback, useState } from "react";

const SIGNATURE_KEY = "clinic_signature";
const STAMP_KEY = "clinic_stamp";

function readFromStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeToStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage quota exceeded or not available
  }
}

function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // not available
  }
}

export function useClinicSettings() {
  const [signature, setSignatureState] = useState<string | null>(() =>
    readFromStorage(SIGNATURE_KEY),
  );
  const [stamp, setStampState] = useState<string | null>(() =>
    readFromStorage(STAMP_KEY),
  );

  const setSignature = useCallback((value: string) => {
    writeToStorage(SIGNATURE_KEY, value);
    setSignatureState(value);
  }, []);

  const setStamp = useCallback((value: string) => {
    writeToStorage(STAMP_KEY, value);
    setStampState(value);
  }, []);

  const clearSignature = useCallback(() => {
    removeFromStorage(SIGNATURE_KEY);
    setSignatureState(null);
  }, []);

  const clearStamp = useCallback(() => {
    removeFromStorage(STAMP_KEY);
    setStampState(null);
  }, []);

  return {
    signature,
    stamp,
    setSignature,
    setStamp,
    clearSignature,
    clearStamp,
  };
}
