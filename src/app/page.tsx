import Image from "next/image";
import { ArrowUpRight, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { WakeGlyph } from "@/components/ui/background-ascii-wake";
import { WordmarkFooter } from "@/components/ui/wordmark-footer";
import { ScrambleText } from "@/components/ui/scramble-text";
import { AsciiWordmark } from "@/components/ascii-wordmark";
import { SiteHeader } from "@/components/site-header";
import { Clip } from "@/components/clip";
import { Reveal } from "@/components/reveal";
import {
  BUILD,
  OPEN,
  PIPELINE,
  PROBLEMS,
  PROJECTS,
  RESEARCH,
  ROADMAP,
  ROLES,
  SITE,
  TEAM,
  WORDMARK_WIDE,
} from "@/lib/content";

const wrap = "mx-auto w-full max-w-[1400px] px-5 md:px-10";
const h2 = "text-3xl font-medium tracking-[-0.03em] leading-[1.08] md:text-5xl";
const eyebrow = "font-mono text-[11px] tracking-[0.16em] text-muted uppercase";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Build />
        <Work />
        <Model />
        <Research />
        <OpenByDefault />
        <Team />
        <Roadmap />
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
              { label: "Roadmap", href: "#roadmap" },
              { label: "Join the lab", href: "#join" },
            ],
          },
          { title: "Projects", links: PROJECTS.map((p) => ({ label: p.name, href: p.href })) },
          {
            title: "Research",
            links: RESEARCH.filter((r) => r.href).map((r) => ({ label: r.name, href: r.href! })),
          },
        ]}
        credits={["Photos: Syced (CC0), Sven Volkens (CC BY-SA 4.0), via Wikimedia Commons"]}
        credit={{ label: "Source on GitHub", href: SITE.repo }}
      />
    </>
  );
}

function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden pt-16">
      <WakeGlyph className="absolute inset-0 opacity-70" cellSize={13} />
      <div className={`${wrap} relative flex flex-col items-center text-center`}>
        <AsciiWordmark
          lines={WORDMARK_WIDE}
          label="ugoki lab"
          className="max-w-full overflow-hidden text-[clamp(4.6px,1.38vw,16px)]"
        />
        <h1 className="mt-10 text-4xl font-medium tracking-[-0.035em] leading-[1.05] md:text-6xl">
          An open lab for physical AI.
        </h1>
        <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-muted md:text-lg">
          We build affordable humanoid robots and an open model that designs real hardware. Free for anyone to use.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#join"
            className="inline-flex h-11 items-center gap-2 bg-foreground px-5 text-[14px] font-medium text-background transition-transform active:translate-y-px"
          >
            Join the lab <ArrowRight size={15} aria-hidden />
          </a>
          <a
            href="#work"
            className="inline-flex h-11 items-center border border-line bg-background/60 px-5 text-[14px] font-medium backdrop-blur-sm transition-colors hover:border-foreground active:translate-y-px"
          >
            See the work
          </a>
        </div>
      </div>
      <p
        aria-hidden="true"
        className="tategaki absolute top-1/2 right-6 hidden -translate-y-1/2 font-jp text-[15px] text-accent lg:block"
      >
        身体を持つ知能
      </p>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="border-t border-line py-24 md:py-36">
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
            <p className="mt-14 max-w-[52ch] text-xl leading-snug md:text-2xl">
              An open, non-profit lab can work on all three at once, and share every result.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function BuildMedia({ item }: { item: (typeof BUILD)[number] }) {
  if ("clip" in item && item.clip) return <Clip src={item.clip} alt={item.alt} />;
  return (
    <Image
      src={item.image!}
      alt={item.alt}
      fill
      sizes="(min-width: 768px) 60vw, 100vw"
      className="object-cover object-[50%_25%]"
    />
  );
}

function Build() {
  // Asymmetric 6-column bento: wide, narrow / narrow, wide.
  const spans = ["md:col-span-4", "md:col-span-2", "md:col-span-2", "md:col-span-4"];
  const heights = ["h-72 md:h-96", "h-72 md:h-96", "h-64 md:h-80", "h-64 md:h-80"];
  return (
    <section id="build" className="border-t border-line py-24 md:py-32">
      <div className={wrap}>
        <Reveal>
          <h2 className={`${h2} max-w-[18ch]`}>What we build</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-6">
          {BUILD.map((item, i) => (
            <Reveal key={item.title} delay={(i % 2) * 0.08} className={`${spans[i]} flex flex-col border border-line bg-surface`}>
              <div className={`relative ${heights[i]} overflow-hidden bg-[#161616]`}>
                <BuildMedia item={item} />
              </div>
              <div className="flex flex-1 flex-col justify-between gap-4 p-6">
                <div>
                  <h3 className="text-xl font-medium tracking-[-0.01em]">{item.title}</h3>
                  <p className="mt-2 max-w-[48ch] leading-relaxed text-muted">{item.body}</p>
                </div>
                {"credit" in item && item.credit && <p className="text-[12px] text-muted">{item.credit}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section id="work" className="border-t border-line py-24 md:py-32">
      <div className={`${wrap} flex flex-col gap-4 md:flex-row md:items-end md:justify-between`}>
        <Reveal>
          <h2 className={`${h2} max-w-[16ch]`}>Already built, already open</h2>
          <p className="mt-4 max-w-[52ch] leading-relaxed text-muted">
            Five robotics projects written from scratch, MIT-licensed, with tests. Every number comes from the repo.
          </p>
        </Reveal>
        <a href={SITE.github} className="inline-flex items-center gap-2 text-[14px] text-muted hover:text-foreground">
          All repositories <ArrowUpRight size={14} aria-hidden />
        </a>
      </div>
      <div className="rail-scroll relative mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-6 md:scroll-px-10 md:px-10 xl:scroll-px-[max(2.5rem,calc((100vw-1400px)/2+2.5rem))] xl:px-[max(2.5rem,calc((100vw-1400px)/2+2.5rem))]">
        {PROJECTS.map((p) => (
          <article key={p.name} className="relative w-[min(82vw,400px)] shrink-0 snap-start border border-line bg-surface">
            <div className="relative aspect-[16/10] overflow-hidden bg-[#161616]">
              <Clip src={p.clip} alt={`${p.name}: ${p.what}`} />
            </div>
            <div className="p-6">
              <h3 className="font-mono text-[15px] font-medium tracking-[0.06em]">
                <ScrambleText>{p.name}</ScrambleText>
              </h3>
              <p className="mt-1 text-[15px]">{p.what}</p>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">{p.metric}</p>
              <a
                href={p.href}
                className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-medium underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
              >
                Code on GitHub <ArrowUpRight size={14} aria-hidden />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Model() {
  return (
    <section id="model" className="border-t border-line py-24 md:py-32">
      <div className={`${wrap} grid gap-12 md:grid-cols-12 md:items-center`}>
        <div className="md:col-span-5">
          <Reveal>
            <h2 className={h2}>An LLM for physical AI that engineers real devices</h2>
          </Reveal>
          <ol className="mt-10 grid gap-6">
            {PIPELINE.map((s, i) => (
              <Reveal as="li" key={s.verb} delay={i * 0.06} className="grid grid-cols-[2.5rem_1fr] items-baseline">
                <span className="font-mono text-[12px] text-muted">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="text-lg font-medium">{s.verb}</p>
                  <p className="text-[15px] text-muted">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
        <Reveal className="md:col-span-7" delay={0.1}>
          <figure>
            <div className="relative aspect-[16/9] overflow-hidden border border-line bg-[#161616]">
              <Image
                src="/media/proto-ide.jpg"
                alt="A generated hardware project open in our prototype’s 3D workspace"
                fill
                sizes="(min-width: 768px) 58vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 max-w-[60ch] text-[14px] leading-relaxed text-muted">
              Our team’s prototype already turns a device graph into CAD, wiring, firmware and a parts list. The lab
              trains an open model for it, with open weights, data and evaluations.
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

function Research() {
  return (
    <section id="research" className="border-t border-line py-24 md:py-32">
      <div className={wrap}>
        <Reveal>
          <p className={eyebrow}>Research</p>
          <h2 className={`${h2} mt-4 max-w-[20ch]`}>Pre-registered studies, negatives included</h2>
        </Reveal>
        <div className="mt-12 border-t border-line">
          {RESEARCH.map((r, i) => {
            const body = (
              <>
                <span className="font-mono text-2xl font-medium tracking-[0.04em] md:text-3xl">{r.name}</span>
                <span className="text-lg leading-snug md:text-xl">{r.question}</span>
                <span className="flex items-center justify-between gap-4 text-[14px] text-muted md:justify-end">
                  {r.status}
                  {r.href && <ArrowUpRight size={16} aria-hidden className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />}
                </span>
              </>
            );
            const cls =
              "group grid gap-3 border-b border-line py-8 md:grid-cols-[12rem_1fr_16rem] md:items-baseline md:gap-8";
            return (
              <Reveal key={r.name} delay={i * 0.06}>
                {r.href ? (
                  <a href={r.href} className={`${cls} transition-colors hover:bg-surface`}>
                    {body}
                  </a>
                ) : (
                  <div className={cls}>{body}</div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function OpenByDefault() {
  const words = [...OPEN, ...OPEN];
  return (
    <section id="open" className="overflow-hidden border-t border-line py-24 md:py-36">
      <div className={wrap}>
        <Reveal>
          <p className="max-w-[22ch] text-4xl font-medium tracking-[-0.035em] leading-[1.06] md:text-7xl">
            Everything we make is free to use: code, weights, data and parts lists.
          </p>
        </Reveal>
      </div>
      <div className="mt-16 flex w-max marquee-track" aria-hidden="true">
        {words.map((w, i) => (
          <span
            key={`${w}-${i}`}
            className={`flex items-center gap-10 pr-10 text-3xl tracking-[-0.02em] text-muted md:text-5xl ${w === "公開" ? "font-jp text-accent" : "font-mono"}`}
          >
            {w}
            <span className="inline-block size-2 bg-line" />
          </span>
        ))}
      </div>
      <p className="sr-only">{OPEN.slice(0, 4).join(", ")}.</p>
    </section>
  );
}

function Team() {
  return (
    <section id="team" className="border-t border-line py-24 md:py-32">
      <div className={wrap}>
        <Reveal>
          <h2 className={`${h2} max-w-[20ch]`}>Defense tech, GovTech and ML research</h2>
          <p className="mt-4 max-w-[52ch] leading-relaxed text-muted">
            The team behind the lab, and what it already runs on.
          </p>
        </Reveal>
        <dl className="mt-14 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {TEAM.map((t, i) => (
            <Reveal key={t.label} delay={i * 0.06} className="border-l border-line pr-6 pl-5">
              <dt className="text-[13px] text-muted">{t.label}</dt>
              <dd className="mt-3 text-3xl font-medium tracking-[-0.03em] md:text-[34px]">{t.big}</dd>
              <dd className="mt-3 text-[14px] leading-relaxed text-muted">{t.body}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Roadmap() {
  return (
    <section id="roadmap" className="border-t border-line py-24 md:py-32">
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
              <h3 className="mt-3 text-2xl font-medium tracking-[-0.02em]">{r.title}</h3>
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
    <section id="join" className="border-t border-line py-24 md:py-36">
      <div className={`${wrap} grid gap-14 md:grid-cols-12`}>
        <Reveal className="md:col-span-7">
          <h2 className="text-4xl font-medium tracking-[-0.035em] leading-[1.04] md:text-7xl">
            Build open physical AI with us.
          </h2>
          <a
            href={SITE.contact}
            className="mt-10 inline-flex h-12 items-center gap-2 bg-foreground px-6 text-[15px] font-medium text-background transition-transform active:translate-y-px"
          >
            Join the lab <ArrowRight size={16} aria-hidden />
          </a>
          <p className="mt-4 max-w-[46ch] text-[14px] leading-relaxed text-muted">
            Opens a short note on GitHub. Tell us who you are and how you’d like to help.
          </p>
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
