import { useCallback, useState } from "react";

const SIGNATURE_KEY = "clinic_signature";
const STAMP_KEY = "clinic_stamp";
const LOGO_KEY = "clinic_logo";

// Default stamp image (uploaded by clinic owner — cap + tanda tangan menyatu)
const DEFAULT_STAMP = "/assets/uploads/photo_2026-03-09_18-47-38-1.jpg";

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
  const [stamp, setStampState] = useState<string | null>(() => {
    const stored = readFromStorage(STAMP_KEY);
    // Use default stamp image if none has been set yet
    return stored ?? DEFAULT_STAMP;
  });
  const [logo, setLogoState] = useState<string | null>(() =>
    readFromStorage(LOGO_KEY),
  );

  const setSignature = useCallback((value: string) => {
    writeToStorage(SIGNATURE_KEY, value);
    setSignatureState(value);
  }, []);

  const setStamp = useCallback((value: string) => {
    writeToStorage(STAMP_KEY, value);
    setStampState(value);
  }, []);

  const setLogo = useCallback((value: string) => {
    writeToStorage(LOGO_KEY, value);
    setLogoState(value);
  }, []);

  const clearSignature = useCallback(() => {
    removeFromStorage(SIGNATURE_KEY);
    setSignatureState(null);
  }, []);

  const clearStamp = useCallback(() => {
    removeFromStorage(STAMP_KEY);
    // Revert to default when cleared
    setStampState(DEFAULT_STAMP);
  }, []);

  const clearLogo = useCallback(() => {
    removeFromStorage(LOGO_KEY);
    setLogoState(null);
  }, []);

  return {
    signature,
    stamp,
    logo,
    setSignature,
    setStamp,
    setLogo,
    clearSignature,
    clearStamp,
    clearLogo,
  };
}
