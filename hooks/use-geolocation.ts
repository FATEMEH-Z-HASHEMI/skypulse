"use client";

import { useCallback, useState } from "react";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type GeolocationStatus =
  "idle" | "loading" | "granted" | "denied" | "unsupported" | "error";

interface State {
  status: GeolocationStatus;
  coords: Coordinates | null;
}

// Open-Meteo's forecast grid is far coarser than GPS precision, and the
// raw browser API returns ~15 significant digits that differ slightly on
// every call — using them as-is fragments the React Query cache key (and
// bloats request URLs) for zero real accuracy gain. Two decimals (~1.1km)
// is plenty for city-level weather.
function round(value: number) {
  return Math.round(value * 100) / 100;
}

export function useGeolocation() {
  const [state, setState] = useState<State>({ status: "idle", coords: null });

  const request = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setState({ status: "unsupported", coords: null });
      return;
    }
    setState((s) => ({ ...s, status: "loading" }));
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setState({
          status: "granted",
          coords: {
            latitude: round(pos.coords.latitude),
            longitude: round(pos.coords.longitude),
          },
        }),
      (err) =>
        setState({
          status: err.code === err.PERMISSION_DENIED ? "denied" : "error",
          coords: null,
        }),
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 5 * 60_000 },
    );
  }, []);

  return { ...state, request };
}
