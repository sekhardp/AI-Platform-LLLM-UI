/** Shape of /config.json — add new settings here as needed. */
export interface AppConfig {
  /** Base URL for the backend API, e.g. "http://api-service:8001" */
  apiBaseUrl: string;
}

const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

const DEFAULT_CONFIG: AppConfig = {
  apiBaseUrl: envApiBaseUrl || 'http://localhost:8001',
};

let _config: AppConfig | null = null;

/**
 * Fetch /config.json once and cache it.
 * Falls back gracefully to DEFAULT_CONFIG when running via `npm run dev`
 * without a config.json in public/, or if the network request fails.
 */
export async function initConfig(): Promise<AppConfig> {
  try {
    const res = await fetch('/config.json', {
      // Always fetch fresh — nginx serves this with Cache-Control: no-store
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as Partial<AppConfig>;
    _config = { ...DEFAULT_CONFIG, ...data };
  } catch (err) {
    console.warn('[config] Failed to load /config.json, using defaults:', err);
    _config = { ...DEFAULT_CONFIG };
  }
  return _config;
}

/**
 * Returns the cached config. Must be called after `initConfig()` resolves.
 * Throws if called before initialisation to surface mis-ordering bugs early.
 */
export function getConfig(): AppConfig {
  if (!_config) {
    throw new Error('[config] getConfig() called before initConfig(). Ensure initConfig() is awaited in main.tsx.');
  }
  return _config;
}
