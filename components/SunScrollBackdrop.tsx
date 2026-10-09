"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import HeroBackdrop from "@/components/HeroBackdrop";
import SunCanvas from "@/components/SunCanvas";

// Fixed background for the home page: the hero Earth fades out and a rising
// Sun fades in as the visitor scrolls down, and back again on the way up.
//
// The Earth layer is the existing HeroBackdrop, unchanged, so the hero looks
// exactly as before and there is only one Earth video (no hand-off pop).
// The Sun image has a black background; mix-blend-mode: screen makes that
// black see-through, so only the glowing Sun shows.
export default function SunScrollBackdrop() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6, restDelta: 0.0005 });

  const earthOpacity = useTransform(progress, [0.15, 0.7], [1, 0]);
  const sunOpacity = useTransform(progress, [0.3, 0.95], [0, 1]);
  const sunScale = useTransform(progress, [0.3, 0.95], [0.85, 1.1]);
  const sunY = useTransform(progress, [0.3, 0.95], ["12%", "0%"]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden bg-ink"
      style={{ zIndex: -1 }}
    >
      {/* Earth: the hero's own video layer, faded by scroll */}
      <motion.div className="absolute inset-0" style={{ opacity: earthOpacity }}>
        <HeroBackdrop />
      </motion.div>

      {/* Sun: rises from the bottom. Screen blend removes its black background;
          the mask softens the image's square edges so no box can show. */}
      <motion.div
        className="sun-rise"
        // Reduced motion: globals.css cancels the scale/rise, leaving a plain cross-fade.
        // (Done in CSS rather than here so server and client render the same markup.)
        style={{ opacity: sunOpacity, scale: sunScale, y: sunY, mixBlendMode: "screen" }}
      >
        {/* Animated in WebGL (churning surface, flares); still image as fallback */}
        <SunCanvas visibility={sunOpacity} />
      </motion.div>

      {/* Keeps the copy readable where the Sun is brightest */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,5,5,0.35)] via-[rgba(5,5,5,0.12)] to-transparent" />
    </div>
  );
}
