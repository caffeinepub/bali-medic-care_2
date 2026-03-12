import { r as reactExports } from "./index-Cj1LDNoz.js";
const SIGNATURE_KEY = "clinic_signature";
const STAMP_KEY = "clinic_stamp";
const LOGO_KEY = "clinic_logo";
const DEFAULT_STAMP = "/assets/uploads/photo_2026-03-09_18-47-38-1.jpg";
function readFromStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeToStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
  }
}
function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch {
  }
}
function useClinicSettings() {
  const [signature, setSignatureState] = reactExports.useState(
    () => readFromStorage(SIGNATURE_KEY)
  );
  const [stamp, setStampState] = reactExports.useState(() => {
    const stored = readFromStorage(STAMP_KEY);
    return stored ?? DEFAULT_STAMP;
  });
  const [logo, setLogoState] = reactExports.useState(
    () => readFromStorage(LOGO_KEY)
  );
  const setSignature = reactExports.useCallback((value) => {
    writeToStorage(SIGNATURE_KEY, value);
    setSignatureState(value);
  }, []);
  const setStamp = reactExports.useCallback((value) => {
    writeToStorage(STAMP_KEY, value);
    setStampState(value);
  }, []);
  const setLogo = reactExports.useCallback((value) => {
    writeToStorage(LOGO_KEY, value);
    setLogoState(value);
  }, []);
  const clearSignature = reactExports.useCallback(() => {
    removeFromStorage(SIGNATURE_KEY);
    setSignatureState(null);
  }, []);
  const clearStamp = reactExports.useCallback(() => {
    removeFromStorage(STAMP_KEY);
    setStampState(DEFAULT_STAMP);
  }, []);
  const clearLogo = reactExports.useCallback(() => {
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
    clearLogo
  };
}
export {
  useClinicSettings as u
};
