import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { playCue, unlockAudio } from "../../lib/sound";

type Props = { onEnter: () => void };

/** Rapid inbound particle warp drawn on a 2D canvas — cheap and smooth. */
function WarpCanvas({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = window.innerWidth < 768 ? 220 : 420;
    const stars = Array.from({ length: COUNT }, () => ({
      a: Math.random() * Math.PI * 2,
      r: Math.random() * 0.5 + 0.02,
      z: Math.random(),
      hue: Math.random() < 0.5 ? 186 : 268,
    }));

    const start = performance.now();
    const draw = (t: number) => {
      const elapsed = (t - start) / 1000;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      ctx.clearRect(0, 0, w, h);
      const boost = active ? 1 : 0.12;
      const speed = active ? 0.9 + Math.min(elapsed, 1.2) * 2.2 : 0.06;

      for (const s of stars) {
        s.r += s.z * 0.004 * speed * 60 * 0.016;
        if (s.r > 1.25) {
          s.r = 0.02;
          s.a = Math.random() * Math.PI * 2;
        }
        const rad = Math.max(w, h) * 0.62;
        const x1 = cx + Math.cos(s.a) * s.r * rad;
        const y1 = cy + Math.sin(s.a) * s.r * rad;
        const trail = s.r * (active ? 0.16 : 0.02);
        const x0 = cx + Math.cos(s.a) * (s.r - trail) * rad;
        const y0 = cy + Math.sin(s.a) * (s.r - trail) * rad;
        ctx.strokeStyle = `hsla(${s.hue}, 100%, ${60 + s.z * 20}%, ${(0.15 + s.r * 0.6) * boost})`;
        ctx.lineWidth = (0.6 + s.z * 1.8) * dpr;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />;
}

export default function IntroGate({ onEnter }: Props) {
  const [open, setOpen] = useState(true);
  const [launching, setLaunching] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const enter = useCallback(() => {
    if (launching) return;
    setLaunching(true);
    unlockAudio();
    playCue("enter");
    const delay = reduced ? 200 : 900;
    window.setTimeout(() => {
      onEnter();
      setOpen(false);
    }, delay);
  }, [launching, onEnter, reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && open) enter();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enter, open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#04060f]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.16]"
            style={{
              backgroundImage:
                "linear-gradient(hsl(186 100% 60% / .35) 1px, transparent 1px), linear-gradient(90deg, hsl(186 100% 60% / .35) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage: "radial-gradient(circle at 50% 50%, #000 10%, transparent 72%)",
            }}
            aria-hidden
          />
          {!reduced && <WarpCanvas active={launching} />}

          {/* expanding glow disc */}
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, hsl(186 100% 70% / .9) 0%, hsl(268 90% 65% / .5) 45%, transparent 70%)",
            }}
            initial={{ scale: 0.2, opacity: 0.35 }}
            animate={launching ? { scale: 26, opacity: 1 } : { scale: 0.9, opacity: 0.35 }}
            transition={{ duration: launching ? 1 : 1.2, ease: [0.65, 0, 0.35, 1] }}
            aria-hidden
          />

          <motion.div
            className="relative z-10 flex flex-col items-center px-6 text-center"
            animate={launching ? { opacity: 0, scale: 1.08, y: -10 } : { opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="text-[0.7rem] tracking-[0.55em] text-cyan-300/70 sm:text-xs"
            >
              TECHFEST 2026
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 bg-gradient-to-r from-cyan-200 via-white to-fuchsia-300 bg-clip-text text-4xl font-extrabold tracking-[0.16em] text-transparent sm:text-6xl md:text-7xl"
            >
              ENTER THE FUTURE
            </motion.h1>

            <motion.button
              type="button"
              onClick={enter}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className="group relative mt-12 grid h-36 w-36 place-items-center rounded-full border border-cyan-300/50 bg-white/5 backdrop-blur-md transition-colors hover:border-cyan-200 sm:h-44 sm:w-44"
              style={{ boxShadow: "0 0 40px hsl(186 100% 60% / .35), inset 0 0 40px hsl(268 90% 65% / .18)" }}
              aria-label="Enter the Techfest 2026 experience"
            >
              <span className="pointer-events-none absolute inset-0 animate-ping rounded-full border border-cyan-300/25" />
              <span className="text-xs font-semibold tracking-[0.35em] text-cyan-100 sm:text-sm">
                ENTER
              </span>
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="mt-8 text-[0.65rem] tracking-[0.3em] text-white/40"
            >
              CLICK OR PRESS ENTER · SOUND OFF
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
