import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { eventDetails, getEvent } from "../data/events";
import Reveal from "../components/site/Reveal";
import { RegistrationDialog, EVENTS } from "../components/site/RegistrationDialog";
import { playCue } from "../lib/sound";

export const Route = createFileRoute("/events/$slug")({
  loader: ({ params }) => {
    const event = getEvent(params.slug);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Event not found — TECHFEST 2026" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { event } = loaderData;
    const title = `${event.name} — TECHFEST 2026`;
    const description = `${event.tagline} Rules, schedule and registration for ${event.name} at TECHFEST 2026.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: EventNotFound,
  errorComponent: EventNotFound,
  component: EventPage,
});

function EventNotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="grid-bg absolute inset-0 opacity-25" />
      <div className="relative">
        <h1 className="neon-text font-display text-4xl font-black">EVENT NOT FOUND</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          That event isn't part of TECHFEST 2026.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block rounded-full border border-primary/60 px-8 py-2.5 font-display text-xs tracking-[0.25em] text-primary uppercase transition-colors hover:bg-primary/10"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}

function EventPage() {
  const { event } = Route.useLoaderData();
  const [open, setOpen] = useState(false);
  const others = eventDetails.filter((e) => e.slug !== event.slug);

  const facts = [
    { label: "Format", value: event.format },
    { label: "Team size", value: event.teamSize },
    { label: "Prize pool", value: event.prize },
    { label: "Venue", value: event.venue },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden pb-28">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-25" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--violet)_22%,transparent),transparent_70%)] blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-6">
        {/* header */}
        <div className="flex items-center justify-between py-8">
          <Link
            to="/"
            className="font-display text-xs tracking-[0.25em] text-muted-foreground uppercase transition-colors hover:text-primary"
          >
            ← TECHFEST 2026
          </Link>
          <Link
            to="/"
            hash="events"
            className="font-display text-xs tracking-[0.25em] text-muted-foreground uppercase transition-colors hover:text-primary"
          >
            All Events
          </Link>
        </div>

        {/* hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="pt-8 sm:pt-16"
        >
          <span className="font-display text-[10px] tracking-[0.35em] text-primary uppercase">
            {event.tag}
          </span>
          <h1 className="neon-text mt-4 font-display text-[clamp(2.4rem,8vw,5rem)] leading-[0.95] font-black">
            {event.name.toUpperCase()}
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {event.tagline}
          </p>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground/90">{event.overview}</p>

          <motion.button
            type="button"
            onClick={() => {
              playCue("hover");
              setOpen(true);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="glow-ring mt-9 inline-block rounded-full bg-[image:var(--gradient-neon)] px-10 py-4 font-display text-xs tracking-[0.3em] text-primary-foreground uppercase focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            Register for {event.name}
          </motion.button>
        </motion.div>

        {/* quick facts */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((f, i) => (
            <Reveal key={f.label} delay={i * 0.06}>
              <div className="glass glow-border h-full rounded-2xl p-5">
                <div className="font-display text-[10px] tracking-[0.3em] text-primary uppercase">
                  {f.label}
                </div>
                <div className="mt-2 text-sm text-foreground">{f.value}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* rules */}
        <section className="mt-24">
          <h2 className="font-display text-2xl font-black tracking-tight sm:text-3xl">Rules</h2>
          <div className="mt-2 h-px w-16 bg-[image:var(--gradient-neon)]" />
          <ul className="mt-8 space-y-4">
            {event.rules.map((r, i) => (
              <Reveal key={r} delay={i * 0.05}>
                <li className="glass glow-border flex gap-4 rounded-2xl p-5">
                  <span className="font-display text-sm font-black text-primary/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-muted-foreground">{r}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* schedule */}
        <section className="mt-24">
          <h2 className="font-display text-2xl font-black tracking-tight sm:text-3xl">Schedule</h2>
          <div className="mt-2 h-px w-16 bg-[image:var(--gradient-neon)]" />
          <div className="relative mt-8 pl-6 sm:pl-8">
            <div className="absolute top-2 bottom-2 left-0 w-px bg-[image:linear-gradient(to_bottom,transparent,var(--cyan),var(--violet),transparent)]" />
            <div className="space-y-5">
              {event.schedule.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.06}>
                  <div className="relative">
                    <span className="absolute top-6 -left-6 h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_var(--cyan)] sm:-left-8" />
                    <div className="glass glow-border rounded-2xl p-5">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="shrink-0 font-display text-[11px] tracking-[0.25em] text-primary uppercase">
                          {s.time}
                        </span>
                        <h3 className="min-w-0 font-display text-lg font-bold">{s.title}</h3>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* how to register */}
        <section className="mt-24">
          <h2 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
            How to Register
          </h2>
          <div className="mt-2 h-px w-16 bg-[image:var(--gradient-neon)]" />
          <ol className="mt-8 space-y-4">
            {event.register.map((r, i) => (
              <Reveal key={r} delay={i * 0.05}>
                <li className="flex gap-4">
                  <span className="glow-ring flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[image:var(--gradient-neon)] font-display text-[11px] text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-sm text-muted-foreground">{r}</span>
                </li>
              </Reveal>
            ))}
          </ol>

          <motion.button
            type="button"
            onClick={() => {
              playCue("hover");
              setOpen(true);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="glow-ring mt-10 inline-block rounded-full bg-[image:var(--gradient-neon)] px-10 py-4 font-display text-xs tracking-[0.3em] text-primary-foreground uppercase focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            Register Now
          </motion.button>
        </section>

        {/* other events */}
        <section className="mt-24">
          <h2 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
            Other Events
          </h2>
          <div className="mt-2 h-px w-16 bg-[image:var(--gradient-neon)]" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                to="/events/$slug"
                params={{ slug: o.slug }}
                className="glass glow-border group rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="font-display text-[10px] tracking-[0.3em] text-primary uppercase">
                  {o.tag}
                </span>
                <h3 className="mt-3 font-display text-lg font-bold">{o.name}</h3>
                <p className="mt-2 text-xs text-muted-foreground">{o.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <RegistrationDialog
        open={open}
        onOpenChange={setOpen}
        defaultEvent={event.name as (typeof EVENTS)[number]}
      />
    </main>
  );
}
