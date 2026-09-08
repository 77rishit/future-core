import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative h-[100svh] w-full overflow-hidden">
      <div className="grid-bg absolute inset-0 opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,color-mix(in_oklab,var(--electric)_22%,transparent),transparent_60%)]" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--background)_72%,transparent),transparent_68%)] sm:bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--background)_55%,transparent),transparent_65%)]" />

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="glass pointer-events-auto rounded-full px-4 py-1 font-display text-[10px] tracking-[0.4em] text-primary uppercase"
        >
          Enter the Future
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30, letterSpacing: "0.4em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.02em" }}
          transition={{ delay: 0.35, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="neon-text mt-6 font-display text-[clamp(2.4rem,9.5vw,7.5rem)] leading-[0.95] font-black drop-shadow-[0_4px_30px_rgba(0,0,0,0.85)]"
        >
          TECHFEST 2026
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.9 }}
          className="mt-4 font-display text-xs tracking-[0.55em] text-foreground/70 uppercase sm:text-sm"
        >
          Enter the Future
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.9 }}
          className="mt-6 max-w-md text-sm text-muted-foreground sm:text-base"
        >
          Where technology meets imagination.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.9 }}
          className="pointer-events-auto mt-10 flex flex-col gap-3 sm:flex-row"
        >
          <a
            href="#about"
            className="glow-ring group relative overflow-hidden rounded-full bg-[image:var(--gradient-neon)] px-8 py-3 font-display text-[11px] tracking-[0.25em] text-primary-foreground uppercase transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            Explore Techfest
          </a>
          <a
            href="#events"
            className="glass glow-border rounded-full px-8 py-3 font-display text-[11px] tracking-[0.25em] text-primary uppercase transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            View Events
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ opacity: textOpacity }}
        className="absolute inset-x-0 bottom-8 z-10 flex justify-center"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          className="h-10 w-6 rounded-full border border-primary/40 p-1"
        >
          <div className="h-2 w-full rounded-full bg-primary/80" />
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
    </section>
  );
}

export default Hero;
