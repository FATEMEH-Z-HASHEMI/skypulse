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
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
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
