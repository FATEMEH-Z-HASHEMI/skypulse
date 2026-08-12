export interface AirQualitySnapshot {
  /** US EPA AQI (0–500 scale). */
  aqi: number;
  pm2_5: number;
  pm10: number;
  carbonMonoxide: number;
  nitrogenDioxide: number;
  sulphurDioxide: number;
  ozone: number;
}
