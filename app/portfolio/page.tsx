import Image from "next/image";
import Reveal from "@/components/Reveal";

const CATEGORIES = [
  { name: "Websites", tag: "Website Systems", img: "/images/site-cloister.png" },
  { name: "Brand Film", tag: "Cinematic Campaigns", img: "/images/mood-clapperboard.png" },
  { name: "Photography", tag: "Editorial & Art Direction", img: "/images/site-gazu.png" },
  { name: "AI Systems", tag: "AI-Assisted Creative", img: "/images/site-morena.png" },
];

export default function PortfolioPage() {
  return (
    <section className="container-edit py-20 md:py-28">
      <Reveal>
        <span className="kicker">Selected work</span>
        <h1 className="mt-4 max-w-2xl font-serif text-4xl text-paper md:text-5xl">
          Every frame is considered.
        </h1>
      </Reveal>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((c) => (
          <Reveal key={c.name}>
            <div className="group overflow-hidden rounded-sm border border-line">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={c.img}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h2 className="font-serif text-lg text-paper">{c.name}</h2>
                <p className="mt-1 text-xs text-muted">{c.tag}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
