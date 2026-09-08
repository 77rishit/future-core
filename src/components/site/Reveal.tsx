import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Reveal className="mx-auto max-w-3xl text-center">
      <span className="glass inline-block rounded-full px-4 py-1 font-display text-[10px] tracking-[0.35em] text-primary uppercase">
        {eyebrow}
      </span>
      <h2 className="neon-text mt-5 font-display text-3xl leading-tight font-black tracking-tight sm:text-5xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-sm text-muted-foreground sm:text-base">{subtitle}</p>
      ) : null}
    </Reveal>
  );
}

export default Reveal;
