import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { WakeGlyph } from "@/components/ui/background-ascii-wake";
import { AsciiDitherMedia } from "@/components/ui/background-ascii-dither";
import { WordmarkFooter } from "@/components/ui/wordmark-footer";
import { NumberTicker } from "@/components/ui/count-up";
import { AsciiWordmark } from "@/components/ascii-wordmark";
import { ModelPlayground } from "@/components/model-playground";
import { PipelineFlow } from "@/components/pipeline-flow";
import { SiteHeader } from "@/components/site-header";
import { Reveal } from "@/components/reveal";
import { Seal } from "@/components/seal";
import { BUILD, FACTS, OPEN, PROBLEMS, RESEARCH, ROADMAP, ROLES, SITE, STATS, WORDMARK_WIDE } from "@/lib/content";

const wrap = "mx-auto w-full max-w-[1400px] px-5 md:px-10";
const h2 = "font-display text-4xl font-normal tracking-[-0.02em] leading-[1.08] md:text-[56px]";
const eyebrow = "font-mono text-[11px] tracking-[0.16em] text-muted uppercase";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <OpenBlock />
        <About />
        <div className="hatch" aria-hidden="true" />
        <Build />
        <Model />
        <div className="hatch" aria-hidden="true" />
        <Research />
        <Team />
        <Roadmap />
        <div className="hatch" aria-hidden="true" />
        <Join />
      </main>
      <WordmarkFooter
        name={SITE.name}
        kanji={SITE.kanji}
        year={2026}
        description="A non-profit research lab for physical AI. Affordable humanoids and an open engineering model, built in the open."
        columns={[
          {
            title: "Lab",
            links: [
              { label: "About", href: "#about" },
              { label: "What we build", href: "#build" },
              { label: "The model", href: "#model" },
            ],
          },
          {
            title: "Work",
            links: [
              { label: "Research", href: "#research" },
              { label: "Team", href: "#team" },
              { label: "Roadmap", href: "#roadmap" },
            ],
          },
          { title: "Contact", links: [{ label: "Join the lab", href: "#join" }] },
        ]}
        credits={["Reference photos: Syced (CC0), Sven Volkens (CC BY-SA 4.0), via Wikimedia Commons"]}
      />
    </>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      <WakeGlyph className="absolute inset-0 text-foreground opacity-50" cellSize={14} />
      <div className={`${wrap} relative`}>
        <p className="flex items-center gap-3 text-[13px] text-muted">
          <Seal className="size-6 rounded-[5px] text-[13px]" />
          <span>
            <span className="font-jp text-foreground">{SITE.kanji}</span> ugoki · a non-profit research lab
          </span>
        </p>
        <h1 className="mt-6 max-w-[14ch] font-display text-5xl font-normal tracking-[-0.025em] leading-[1.02] md:text-[88px]">
          An open lab for <em className="text-accent">physical AI</em>.
        </h1>
        <p className="mt-6 max-w-[48ch] text-base leading-relaxed text-muted md:text-lg">
          We build affordable humanoid robots and an open model that designs real hardware. Free for anyone to use.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#join"
            className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-foreground px-5 text-[14px] font-medium text-background transition-transform active:translate-y-px"
          >
            Join the lab <ArrowRight size={15} aria-hidden />
          </a>
          <a
            href="#model"
            className="inline-flex h-11 items-center rounded-[10px] border border-line bg-surface/70 px-5 text-[14px] font-medium backdrop-blur-sm transition-colors hover:border-foreground active:translate-y-px"
          >
            How the model works
          </a>
        </div>
        <Reveal className="mt-14 md:mt-20" delay={0.15}>
          <ModelPlayground />
        </Reveal>
      </div>
      <p aria-hidden="true" className="tategaki absolute top-40 right-6 hidden font-jp text-[15px] text-accent xl:block">
        身体を持つ知能
      </p>
    </section>
  );
}

function OpenBlock() {
  return (
    <section aria-label="Open by default" className={`${wrap} pb-20 md:pb-28`}>
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-2xl bg-accent px-6 py-16 text-center text-accent-ink md:px-12 md:py-24">
          <AsciiDitherMedia mode="ascii" cellSize={13} speed={0.7} className="absolute inset-0 -z-10 text-accent-ink opacity-25" />
          <AsciiWordmark
            lines={WORDMARK_WIDE}
            label="ugoki lab"
            className="mx-auto max-w-full overflow-hidden text-[clamp(4.2px,1.2vw,14px)] [&_pre]:text-accent-ink"
          />
          <p className="mx-auto mt-10 max-w-[20ch] font-display text-4xl leading-[1.08] tracking-[-0.02em] md:text-6xl">
            Physical AI should belong to everyone.
          </p>
          <p className="mx-auto mt-5 max-w-[46ch] text-[15px] leading-relaxed opacity-90 md:text-base">
            Everything we make is free to use: code, model weights, data, CAD and parts lists.
          </p>
          <ul className="mt-9 flex flex-wrap justify-center gap-2">
            {OPEN.map((item) => (
              <li
                key={item}
                className={`rounded-full border border-accent-ink/40 px-4 py-1.5 text-[13px] ${item === "公開" ? "font-jp" : "font-mono"}`}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-24 md:py-32">
      <div className={`${wrap} grid gap-14 md:grid-cols-12`}>
        <Reveal className="md:col-span-4">
          <div className="md:sticky md:top-28">
            <p className="font-jp text-[96px] leading-none font-bold text-accent md:text-[132px]">{SITE.kanji}</p>
            <p className="mt-6 max-w-[30ch] text-[15px] leading-relaxed text-muted">
              Ugoki means “movement” in Japanese. We put intelligence into things that move, and we give it away.
            </p>
          </div>
        </Reveal>
        <div className="md:col-span-8">
          <Reveal>
            <h2 className={h2}>
              The robots and models that will shape the physical world are expensive, closed and slow to build.
            </h2>
          </Reveal>
          <ol className="mt-14 grid gap-10">
            {PROBLEMS.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.08} className="grid grid-cols-[3rem_1fr] gap-4 md:grid-cols-[5rem_1fr]">
                <span className="font-jp text-3xl text-muted md:text-4xl" aria-hidden="true">
                  {p.n}
                </span>
                <div>
                  <h3 className="text-xl font-medium tracking-[-0.01em] md:text-2xl">{p.title}</h3>
                  <p className="mt-2 max-w-[58ch] leading-relaxed text-muted">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <Reveal>
            <p className="mt-14 max-w-[40ch] font-display text-2xl leading-snug md:text-3xl">
              An open, non-profit lab can work on all three at once, and share every result.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Build() {
  const { humanoids, model, sim, impact } = BUILD;
  const card = "flex flex-col overflow-hidden rounded-2xl border border-line bg-surface";
  const text = "flex flex-1 flex-col justify-between gap-4 p-6 md:p-7";
  return (
    <section id="build" className="py-24 md:py-32">
      <div className={wrap}>
        <Reveal>
          <h2 className={h2}>What we build</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-6">
          <Reveal className={`${card} md:col-span-4`}>
            <div className="relative h-72 md:h-96">
              <Image src={humanoids.image} alt={humanoids.alt} fill sizes="(min-width: 768px) 60vw, 100vw" className="object-cover object-[50%_30%] grayscale" />
            </div>
            <div className={text}>
              <div>
                <h3 className="font-display text-2xl">{humanoids.title}</h3>
                <p className="mt-2 max-w-[54ch] leading-relaxed text-muted">{humanoids.body}</p>
              </div>
              <p className="text-[12px] text-muted">{humanoids.credit}</p>
            </div>
          </Reveal>
          <Reveal delay={0.08} className={`${card} md:col-span-2`}>
            <div className="relative flex h-72 items-center justify-center bg-background md:h-96">
              <span className="font-jp text-[110px] leading-none font-bold text-foreground md:text-[140px]" aria-hidden="true">
                設計
              </span>
              <span className="absolute bottom-4 left-5 font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
                sekkei · design
              </span>
            </div>
            <div className={text}>
              <div>
                <h3 className="font-display text-2xl">{model.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{model.body}</p>
              </div>
            </div>
          </Reveal>
          <Reveal className={`${card} md:col-span-2`}>
            <div className="relative h-64 bg-foreground md:h-80">
              <AsciiDitherMedia mode="dot" cellSize={12} speed={0.8} className="absolute inset-0 text-background opacity-80" />
            </div>
            <div className={text}>
              <div>
                <h3 className="font-display text-2xl">{sim.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{sim.body}</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08} className={`${card} md:col-span-4`}>
            <div className="relative h-64 md:h-80">
              <Image src={impact.image} alt={impact.alt} fill sizes="(min-width: 768px) 60vw, 100vw" className="object-cover object-[50%_25%] grayscale" />
            </div>
            <div className={text}>
              <div>
                <h3 className="font-display text-2xl">{impact.title}</h3>
                <p className="mt-2 max-w-[54ch] leading-relaxed text-muted">{impact.body}</p>
              </div>
              <p className="text-[12px] text-muted">{impact.credit}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Model() {
  return (
    <section id="model" className="pb-24 md:pb-32">
      <div className={wrap}>
        <Reveal>
          <h2 className={`${h2} max-w-[18ch]`}>
            How the open model <em className="text-accent">works</em>
          </h2>
          <p className="mt-5 max-w-[56ch] leading-relaxed text-muted">
            An LLM for physical AI that engineers real devices. Every step is checked by physics before anything is
            built, and the weights, data and evaluations are open.
          </p>
        </Reveal>
        <Reveal className="mt-12" delay={0.1}>
          <PipelineFlow />
        </Reveal>
      </div>
    </section>
  );
}

function Research() {
  return (
    <section id="research" className="py-24 md:py-32">
      <div className={wrap}>
        <Reveal>
          <p className={eyebrow}>Research</p>
          <h2 className={`${h2} mt-4 max-w-[20ch]`}>Pre-registered studies, negatives included</h2>
        </Reveal>
        <div className="mt-12 border-t border-line">
          {RESEARCH.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.06}>
              <div className="grid gap-3 border-b border-line py-8 md:grid-cols-[12rem_1fr_14rem] md:items-baseline md:gap-8">
                <span className="font-mono text-2xl font-medium tracking-[0.04em] md:text-3xl">{r.name}</span>
                <span className="font-display text-xl leading-snug md:text-2xl">{r.question}</span>
                <span className="text-[14px] text-muted md:text-right">{r.status}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Team() {
  return (
    <section id="team" className="pb-24 md:pb-32">
      <div className={wrap}>
        <Reveal>
          <h2 className={`${h2} max-w-[20ch]`}>
            Who builds the <em className="text-accent">lab</em>
          </h2>
          <p className="mt-5 max-w-[52ch] leading-relaxed text-muted">
            A team from defense tech, GovTech and ML research, and what the lab already runs on.
          </p>
        </Reveal>
        <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 overflow-x-clip lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className="border-t border-line pt-6">
              <dd className="font-display text-5xl tracking-[-0.02em] md:text-6xl">
                <NumberTicker value={s.value} suffix={s.suffix} duration={1.2} delay={i * 0.12} />
              </dd>
              <dt className="mt-3 text-[15px] font-medium">{s.label}</dt>
              <dd className="mt-2 max-w-[30ch] text-[14px] leading-relaxed text-muted">{s.body}</dd>
            </Reveal>
          ))}
        </dl>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {FACTS.map((f, i) => (
            <Reveal key={f.big} delay={i * 0.06} className="rounded-2xl border border-line bg-surface p-7">
              <p className="font-display text-3xl tracking-[-0.01em] md:text-4xl">{f.big}</p>
              <p className="mt-3 max-w-[44ch] leading-relaxed text-muted">{f.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Roadmap() {
  return (
    <section id="roadmap" className="pb-24 md:pb-32">
      <div className={wrap}>
        <Reveal>
          <p className={eyebrow}>Roadmap</p>
          <h2 className={`${h2} mt-4 max-w-[20ch]`}>Start small, open everything, then scale</h2>
        </Reveal>
        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-0">
          {ROADMAP.map((r, i) => (
            <Reveal as="li" key={r.when} delay={i * 0.08} className="relative md:pr-10">
              <div className="mb-6 h-px w-full bg-line">
                <div className={`h-px ${i === 0 ? "w-16 bg-accent" : "w-0"}`} />
              </div>
              <p className="font-mono text-[12px] tracking-[0.08em] text-muted">
                {r.when}
                {i === 0 && <span className="ml-2 text-accent">now</span>}
              </p>
              <h3 className="mt-3 font-display text-2xl">{r.title}</h3>
              <p className="mt-3 max-w-[40ch] leading-relaxed text-muted">{r.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Join() {
  return (
    <section id="join" className="py-24 md:py-32">
      <div className={`${wrap} grid gap-14 md:grid-cols-12`}>
        <Reveal className="md:col-span-7">
          <h2 className="font-display text-5xl tracking-[-0.025em] leading-[1.02] md:text-[80px]">
            Build open physical AI <em className="text-accent">with us</em>.
          </h2>
          {SITE.contact ? (
            <a
              href={SITE.contact}
              className="mt-10 inline-flex h-12 items-center gap-2 rounded-[10px] bg-foreground px-6 text-[15px] font-medium text-background transition-transform active:translate-y-px"
            >
              Join the lab <ArrowRight size={16} aria-hidden />
            </a>
          ) : (
            <p className="mt-10 max-w-[46ch] leading-relaxed text-muted">
              Contact details are coming soon.
            </p>
          )}
        </Reveal>
        <Reveal className="md:col-span-5" delay={0.1}>
          <p className="text-[13px] text-muted">We are looking for</p>
          <ul className="mt-4 border-t border-line">
            {ROLES.map((role) => (
              <li key={role} className="flex items-center justify-between border-b border-line py-5 text-lg md:text-xl">
                {role}
                <span className="font-jp text-[13px] text-muted" aria-hidden="true">
                  募集
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
