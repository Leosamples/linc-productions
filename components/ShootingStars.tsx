// Pure-CSS shooting stars. Positions and timing are fixed (not random) so
// server and client render identically.
//
// Default: fills its (relative) parent, as in the hero.
// fullscreen: fixed to the viewport behind the content, with streaks spread
// over the whole screen so they fire the entire way down the page.
const STARS = [
  { top: "6%", left: "78%", delay: "0s", duration: "7s" },
  { top: "14%", left: "48%", delay: "2.6s", duration: "9s" },
  { top: "2%", left: "96%", delay: "4.8s", duration: "8s" },
  { top: "22%", left: "88%", delay: "6.5s", duration: "11s" },
  { top: "10%", left: "30%", delay: "8.2s", duration: "10s" },
  { top: "30%", left: "70%", delay: "10.4s", duration: "12s" },
];

const FULLSCREEN_STARS = [
  ...STARS,
  { top: "44%", left: "92%", delay: "1.4s", duration: "10s" },
  { top: "58%", left: "62%", delay: "3.9s", duration: "12s" },
  { top: "38%", left: "40%", delay: "5.7s", duration: "9s" },
  { top: "66%", left: "98%", delay: "7.6s", duration: "11s" },
  { top: "52%", left: "28%", delay: "9.3s", duration: "13s" },
  { top: "72%", left: "76%", delay: "11.8s", duration: "10s" },
];

export default function ShootingStars({ fullscreen = false }: { fullscreen?: boolean }) {
  const stars = fullscreen ? FULLSCREEN_STARS : STARS;
  return (
    <div
      aria-hidden
      className={`pointer-events-none overflow-hidden ${fullscreen ? "fixed inset-0" : "absolute inset-0"}`}
      style={fullscreen ? { zIndex: -1 } : undefined}
    >
      {stars.map((s, i) => (
        <span
          key={i}
          className="shooting-star"
          style={{
            top: s.top,
            left: s.left,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}
    </div>
  );
}
