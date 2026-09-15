/**
 * Reads and parses a JSON value from local storage.
 *
 * @param key - Storage key to read.
 * @param fallback - Value returned when the key is absent, malformed, or inaccessible.
 */
export function getStoredValue<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : (JSON.parse(value) as T);
  } catch {
    return fallback;
  }
}

/**
 * Serializes a value to local storage when storage is available.
 *
 * Storage failures are intentionally ignored so optional persistence cannot break the UI.
 *
 * @param key - Storage key to write.
 * @param value - JSON-serializable value to persist.
 */
export function setStoredValue<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable in private browsing or restrictive environments.
  }
}
