#!/usr/bin/env node
// Turns a rotating-Earth clip into a seamless, compressed loop for the
// /portfolio space backdrop.
//
// Usage: npm run space-video -- <path to mp4>
// Output: public/archive/media/video/earth-space.mp4
//
// The loop is made by cutting the first and last d seconds off the middle
// of the clip and cross-fading the end back into the start, so the last
// frame flows straight into the first. A 10-second input becomes 8.5 s.

import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OVERLAP = 1.5; // d, seconds
const MIN_DURATION = 4; // seconds
const WARN_BYTES = 6 * 1024 * 1024;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "archive", "media", "video");
const outFile = path.join(outDir, "earth-space.mp4");

function fail(message) {
  console.error(message);
  process.exit(1);
}

function hasTool(name) {
  return spawnSync(name, ["-version"], { stdio: "ignore" }).status === 0;
}

const input = process.argv[2];
if (!input) fail("Usage: npm run space-video -- <path to mp4>");
if (!existsSync(input)) fail(`File not found: ${input}`);
if (!hasTool("ffmpeg") || !hasTool("ffprobe")) fail("Install ffmpeg: brew install ffmpeg");

let duration;
try {
  duration = parseFloat(
    execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", input], {
      encoding: "utf8",
    }).trim()
  );
} catch {
  fail(`Couldn't read the video's duration. Is ${input} a video file?`);
}
if (!Number.isFinite(duration)) fail("Couldn't read the video's duration.");
if (duration < MIN_DURATION) fail(`The clip is ${duration.toFixed(2)} s long. It needs to be at least ${MIN_DURATION} s to loop smoothly.`);

const d = OVERLAP;
const D = duration;
const fmt = (n) => n.toFixed(3);
const graph =
  `[0:v]trim=start=${fmt(d)}:end=${fmt(D - d)},setpts=PTS-STARTPTS[mid];` +
  `[0:v]trim=start=${fmt(D - d)}:end=${fmt(D)},setpts=PTS-STARTPTS[tail];` +
  `[0:v]trim=start=0:end=${fmt(d)},setpts=PTS-STARTPTS[head];` +
  `[tail][head]xfade=transition=fade:duration=${fmt(d)}:offset=0[x];` +
  `[mid][x]concat=n=2:v=1:a=0[v]`;

mkdirSync(outDir, { recursive: true });
console.log(`Input: ${input} (${D.toFixed(2)} s). Building a ${(D - d).toFixed(2)} s seamless loop…`);

const result = spawnSync(
  "ffmpeg",
  ["-y", "-loglevel", "error", "-i", input, "-filter_complex", graph, "-map", "[v]", "-an",
    "-c:v", "libx264", "-crf", "24", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", outFile],
  { stdio: "inherit" }
);
if (result.status !== 0) fail("ffmpeg failed. See the error above.");

const bytes = statSync(outFile).size;
const mb = (bytes / 1024 / 1024).toFixed(2);
console.log(`\nWrote ${path.relative(root, outFile)} (${mb} MB)`);
if (bytes > WARN_BYTES) {
  console.warn(`Warning: that's over 6 MB. Visitors download it before it plays. Try a shorter or lower-resolution clip.`);
}
console.log(`\nPaste this into the "space" object in public/archive/manifest.json:`);
console.log(`"earthVideo": "/archive/media/video/earth-space.mp4"`);
