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
