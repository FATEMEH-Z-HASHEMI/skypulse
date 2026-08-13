export interface AppSettings {
  temperatureUnit: "celsius" | "fahrenheit";
  windUnit: "kmh" | "mph";
  language: "fa" | "en";
  autoDetectLocation: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  temperatureUnit: "celsius",
  windUnit: "kmh",
  language: "fa",
  autoDetectLocation: true,
};
