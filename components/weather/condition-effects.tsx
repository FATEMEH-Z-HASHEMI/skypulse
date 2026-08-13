import type { WeatherConditionKey } from "@/types/weather-condition";

// Deterministic pseudo-randomness (no Math.random): this renders inside a
// client component tree, so a random value here would draw a different
// number on the server-rendered pass than on client hydration and trip a
// hydration mismatch. Index-based math gives a stable, good-enough spread.
function pseudoRandom(seed: number, mod: number) {
  return (seed * 2654435761) % mod;
}

function RainLayer({
  count,
  storm = false,
}: {
  count: number;
  storm?: boolean;
}) {
  const drops = Array.from({ length: count }, (_, i) => ({
    left: pseudoRandom(i + 1, 1000) / 10, // 0–100%
    delay: (pseudoRandom(i + 7, 1200) / 1000) * (storm ? 0.8 : 1.4),
    duration: (storm ? 0.5 : 0.7) + (pseudoRandom(i + 3, 400) / 1000) * 0.5,
    height: storm ? 18 : 14,
  }));
  return (
    <>
      {drops.map((d, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="absolute top-0 w-px animate-[rain-fall_1s_linear_infinite] bg-current opacity-60"
          style={{
            left: `${d.left}%`,
            height: d.height,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
          }}
        />
      ))}
    </>
  );
}

function SunEffect() {
  return (
    <div aria-hidden="true" className="absolute end-8 -top-8 h-36 w-36">
      <div
        className="absolute inset-0   animate-[sun-spin_32s_linear_infinite] rounded-full opacity-50"
        style={{
          background:
            "repeating-conic-gradient(currentColor 0deg 6deg, transparent 6deg 24deg)",
          maskImage: "radial-gradient(circle, black 42%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(circle, black 42%, transparent 72%)",
        }}
      />
      <div className="absolute inset-11 animate-[sun-pulse_4s_ease-in-out_infinite] rounded-full bg-current" />
    </div>
  );
}

function CloudyEffect() {
  const blobs = [
    { top: 8, width: 130, duration: 34, delay: 0, opacity: 0.3 },
    { top: 42, width: 95, duration: 26, delay: -8, opacity: 0.22 },
    { top: 66, width: 75, duration: 40, delay: -20, opacity: 0.18 },
  ];
  return (
    <>
      {blobs.map((b, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="absolute animate-[cloud-drift_1s_linear_infinite] rounded-full bg-current blur-lg"
          style={{
            top: `${b.top}%`,
            width: b.width,
            height: b.width * 0.5,
            opacity: b.opacity,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </>
  );
}

function SnowEffect() {
  const flakes = Array.from({ length: 22 }, (_, i) => ({
    left: pseudoRandom(i + 1, 1000) / 10,
    delay: (pseudoRandom(i + 5, 3000) / 1000) * 2,
    duration: 3 + (pseudoRandom(i + 9, 2000) / 1000) * 2,
    size: 3 + pseudoRandom(i + 2, 3),
  }));
  return (
    <>
      {flakes.map((f, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="absolute top-0 animate-[snow-fall_3s_linear_infinite] rounded-full bg-current opacity-70"
          style={{
            left: `${f.left}%`,
            width: f.size,
            height: f.size,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
          }}
        />
      ))}
    </>
  );
}

function StormEffect() {
  return (
    <>
      <RainLayer count={28} storm />
      <span
        aria-hidden="true"
        className="absolute inset-0 animate-[lightning-flash_6s_ease-in-out_infinite] bg-current opacity-0"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 animate-[lightning-flash_9s_ease-in-out_infinite] bg-current opacity-0"
        style={{ animationDelay: "3.2s" }}
      />
    </>
  );
}

export function ConditionEffects({
  conditionKey,
}: {
  conditionKey: WeatherConditionKey;
}) {
  switch (conditionKey) {
    case "sunny":
      return <SunEffect />;
    case "cloudy":
      return <CloudyEffect />;
    case "rain":
      return <RainLayer count={22} />;
    case "snow":
      return <SnowEffect />;
    case "storm":
      return <StormEffect />;
    default:
      return null;
  }
}
