import Reveal from "@/components/Reveal";
import StrategyForm from "@/components/StrategyForm";

export default function StrategyPage() {
  return (
    <section className="container-edit py-20 md:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="kicker mx-auto justify-center">Strategy Session</span>
        <h1 className="mt-4 font-serif text-4xl text-paper md:text-5xl">
          Let&rsquo;s build your system.
        </h1>
      </Reveal>

      <div className="mx-auto mt-14 max-w-2xl">
        <StrategyForm />
      </div>
    </section>
  );
}
