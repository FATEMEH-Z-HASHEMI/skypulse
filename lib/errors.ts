export type WeatherApiErrorCode =
  | "INVALID_REQUEST"
  | "NOT_FOUND"
  | "NETWORK_ERROR"
  | "RATE_LIMITED"
  | "UPSTREAM_ERROR"
  | "VALIDATION_ERROR";

export class WeatherApiError extends Error {
  readonly code: WeatherApiErrorCode;
  readonly status: number;

  constructor(code: WeatherApiErrorCode, message: string, status = 502) {
    super(message);
    this.name = "WeatherApiError";
    this.code = code;
    this.status = status;
  }
}
