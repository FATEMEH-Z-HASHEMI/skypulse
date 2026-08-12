export interface GeocodingResult {
  id: number;
  name: string;
  country: string | null;
  countryCode: string | null;
  /** State/province, when the provider has one. */
  admin1: string | null;
  latitude: number;
  longitude: number;
  timezone: string;
  population: number | null;
}

/** Reverse-geocoding provider gives no stable id/timezone — lighter shape. */
export interface ReverseGeocodingResult {
  name: string;
  country: string | null;
  countryCode: string | null;
  admin1: string | null;
  latitude: number;
  longitude: number;
}
