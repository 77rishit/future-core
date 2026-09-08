import { animate, motion, useInView, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import EnergyCore from "../three/EnergyCore";
import Reveal, { SectionHeading } from "./Reveal";
import TiltCard from "./TiltCard";

/* ---------------------------------- ABOUT --------------------------------- */

const pillars = [
  { title: "Code", body: "Marathon builds, algorithms and open-source sprints." },
  { title: "Robotics", body: "Autonomous machines, combat bots and control systems." },
  { title: "AI", body: "Models, agents and applied machine intelligence." },
  { title: "Play", body: "Esports arenas, XR demos and creative game jams." },
];

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);

  return (
    <section id="about" ref={ref} className="relative overflow-hidden py-28 sm:py-36">
      <motion.div style={{ y }} className="pointer-events-none absolute -right-24 top-10 h-[420px] w-[420px] opacity-70">
        <EnergyCore className="h-full w-full" scale={0.55} dpr={[1, 1.2]} />
      </motion.div>

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="About"
          title="A Playground for Innovators"
          subtitle="TECHFEST 2026 gathers builders, hackers and designers for three days of coding, robotics, AI, gaming and raw innovation — a campus turned into a live laboratory of the future."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="glass glow-border h-full rounded-2xl p-6">
                <div className="font-display text-4xl font-black text-primary/25">0{i + 1}</div>
                <h3 className="mt-3 font-display text-lg font-bold tracking-wide">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- EVENTS --------------------------------- */

const events = [
  { name: "Hackathon", tag: "36 HRS", desc: "Build a working product overnight with mentors on the floor." },
  { name: "Robo Wars", tag: "ARENA", desc: "Steel, servos and sparks in the combat cage." },
  { name: "AI Challenge", tag: "MODELS", desc: "Train, fine-tune and ship intelligence under pressure." },
  { name: "Code Sprint", tag: "3 HRS", desc: "Lightning-fast competitive programming rounds." },
  { name: "Gaming Arena", tag: "ESPORTS", desc: "LAN tournaments across the biggest titles." },
  { name: "Innovation Expo", tag: "SHOWCASE", desc: "Demo your prototype to industry judges and investors." },
];

export function Events() {
  return (
    <section id="events" className="relative py-28 sm:py-36">
      <div className="grid-bg absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Events"
          title="Six Arenas. One Weekend."
          subtitle="Pick your battlefield — every event runs with live scoring and open spectator access."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e, i) => (
            <Reveal key={e.name} delay={i * 0.06}>
              <TiltCard className="h-full">
                <div className="glass glow-border group relative h-full overflow-hidden rounded-2xl p-6">
                  <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--violet)_45%,transparent),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[10px] tracking-[0.3em] text-primary uppercase">
                      {e.tag}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_var(--cyan)]" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-black tracking-tight">{e.name}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{e.desc}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-[11px] tracking-[0.2em] text-primary uppercase transition-transform duration-300 group-hover:translate-x-1">
                    Enter →
                  </span>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- DOMAINS -------------------------------- */

const domains = ["AI", "ROBOTICS", "WEB3", "CYBERSECURITY", "GAME DEV", "IoT"];

export function Domains() {
  return (
    <section id="domains" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="Domains" title="Tracks of the Future" />

        <div className="mt-14 flex flex-wrap justify-center gap-5">
          {domains.map((d, i) => (
            <Reveal key={d} delay={i * 0.07}>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 + i * 0.4, ease: "easeInOut" }}
                whileHover={{ scale: 1.08, rotateX: -8, rotateY: 8 }}
                style={{ transformPerspective: 800 }}
                className="glass glow-border rounded-2xl px-8 py-6 text-center"
              >
                <span className="font-display text-sm font-black tracking-[0.25em] text-foreground sm:text-base">
                  {d}
                </span>
                <div className="mx-auto mt-3 h-px w-10 bg-[image:var(--gradient-neon)]" />
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- TIMELINE -------------------------------- */

const phases = [
  { step: "01", title: "Registration", date: "Feb 02 – Feb 20", body: "Teams lock in and pick their tracks." },
  { step: "02", title: "Prelims", date: "Feb 24", body: "Online qualifiers across every domain." },
  { step: "03", title: "Workshops", date: "Mar 05 – Mar 06", body: "Hands-on labs with industry engineers." },
  { step: "04", title: "Competitions", date: "Mar 07 – Mar 08", body: "48 hours of on-campus head-to-head builds." },
  { step: "05", title: "Grand Finale", date: "Mar 09", body: "Demo day, awards and the closing showcase." },
];

export function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="timeline" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeading eyebrow="Timeline" title="The Road to the Finale" />

        <div ref={ref} className="relative mt-16 pl-10 sm:pl-16">
          <div className="absolute top-0 left-3 h-full w-px bg-border sm:left-6" />
          <motion.div
            style={{ height }}
            className="absolute top-0 left-3 w-px bg-[image:var(--gradient-neon)] shadow-[0_0_18px_var(--cyan)] sm:left-6"
          />

          <div className="space-y-12">
            {phases.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05}>
                <div className="relative">
                  <span className="absolute top-2 -left-[30px] h-3 w-3 rounded-full bg-primary shadow-[0_0_16px_var(--cyan)] sm:-left-[42px]" />
                  <div className="glass glow-border rounded-2xl p-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-display text-xs tracking-[0.3em] text-primary">
                        {p.step}
                      </span>
                      <h3 className="font-display text-xl font-bold">{p.title}</h3>
                      <span className="ml-auto text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                        {p.date}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- STATS --------------------------------- */

const stats = [
  { value: 50, suffix: "+", label: "Events" },
  { value: 2000, suffix: "+", label: "Participants" },
  { value: 20, suffix: "+", label: "Workshops" },
  { value: 24, suffix: "", label: "Hours of Innovation" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className="neon-text font-display text-4xl font-black sm:text-5xl">
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="Why Techfest" title="Numbers That Move" />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="glass glow-border rounded-2xl p-8 text-center">
                <Counter to={s.value} suffix={s.suffix} />
                <p className="mt-3 text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- FINAL CTA ------------------------------- */

export function FinalCta() {
  return (
    <section id="register" className="relative overflow-hidden py-32 sm:py-44">
      <div className="absolute inset-0 opacity-90">
        <EnergyCore className="h-full w-full" scale={1.25} dpr={[1, 1.3]} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--background)_75%)]" />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <h2 className="neon-text font-display text-[clamp(2rem,7vw,4.5rem)] leading-tight font-black">
            READY TO BUILD THE FUTURE?
          </h2>
          <p className="mt-5 text-sm text-muted-foreground sm:text-base">
            Registrations for TECHFEST 2026 are open. Bring a team, bring an idea.
          </p>
          <motion.a
            href="#top"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            className="glow-ring mt-10 inline-block rounded-full bg-[image:var(--gradient-neon)] px-10 py-4 font-display text-xs tracking-[0.3em] text-primary-foreground uppercase"
          >
            Register Now
          </motion.a>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-[11px] tracking-[0.2em] text-muted-foreground uppercase sm:flex-row">
        <span className="font-display text-foreground">TECHFEST 2026</span>
        <span>Enter the Future</span>
      </div>
    </footer>
  );
}
