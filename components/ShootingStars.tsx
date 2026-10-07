// Pure-CSS shooting stars for the hero. Positions and timing are fixed
// (not random) so server and client render identically.
const STARS = [
  { top: "6%", left: "78%", delay: "0s", duration: "7s" },
  { top: "14%", left: "48%", delay: "2.6s", duration: "9s" },
  { top: "2%", left: "96%", delay: "4.8s", duration: "8s" },
  { top: "22%", left: "88%", delay: "6.5s", duration: "11s" },
  { top: "10%", left: "30%", delay: "8.2s", duration: "10s" },
  { top: "30%", left: "70%", delay: "10.4s", duration: "12s" },
];

export default function ShootingStars() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {STARS.map((s, i) => (
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
