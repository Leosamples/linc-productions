import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

const WORK = [
  { name: "Photography", tagline: "Editorial and product photography with art direction.", img: "/images/mood-newspaper.png" },
  { name: "Film", tagline: "Brand film and commercial production, concept to final cut.", img: "/images/mood-clapperboard.png" },
  { name: "Podcast", tagline: "Full-service podcast production and post.", img: "/images/mood-directorchair.png" },
  { name: "Commercial Production", tagline: "On-location and studio production for campaigns.", img: "/images/mood-denim.png" },
];

export default function StudioPage() {
  return (
    <section className="container-edit py-20 md:py-28">
      <Reveal>
        <span className="kicker">Production</span>
        <h1 className="mt-4 max-w-2xl font-serif text-4xl text-paper md:text-5xl">
          The studio.
        </h1>
        <p className="mt-5 max-w-copy text-base leading-relaxed text-muted md:text-lg">
          Photography, film, podcast and commercial production — run with
          cinematic control from concept to final cut.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {WORK.map((w) => (
          <Reveal key={w.name}>
            <div className="group overflow-hidden rounded-sm border border-line">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={w.img}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h2 className="font-serif text-xl text-paper">{w.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{w.tagline}</p>
                <Link
                  href="/strategy"
                  className="mt-4 inline-block focus-ring rounded-sm text-sm text-muted transition-colors hover:text-signal"
                >
                  Discuss this project →
                </Link>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
