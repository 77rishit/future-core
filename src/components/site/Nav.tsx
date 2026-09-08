import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const links = [
  { label: "About", href: "#about" },
  { label: "Events", href: "#events" },
  { label: "Domains", href: "#domains" },
  { label: "Timeline", href: "#timeline" },
  { label: "Register", href: "#register" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3 transition-all duration-500 ${
          scrolled ? "glass glow-ring" : "border border-transparent"
        }`}
      >
        <a href="#top" className="font-display text-sm font-black tracking-[0.28em] text-foreground">
          TF<span className="text-primary">26</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="relative text-xs tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-primary after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#register"
            className="glass glow-border hidden rounded-full px-5 py-2 font-display text-[11px] tracking-[0.2em] text-primary uppercase transition-transform duration-300 hover:scale-105 md:inline-block"
          >
            Register
          </a>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="glass rounded-xl p-2 md:hidden"
          >
            <div className="space-y-1">
              <span className="block h-px w-5 bg-primary" />
              <span className="block h-px w-5 bg-primary" />
              <span className="block h-px w-5 bg-primary" />
            </div>
          </button>
        </div>
      </nav>

      {open ? (
        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass mx-auto mt-2 max-w-6xl space-y-1 rounded-2xl p-4 md:hidden"
        >
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-xs tracking-[0.2em] text-muted-foreground uppercase hover:bg-secondary/40 hover:text-primary"
              >
                {l.label}
              </a>
            </li>
          ))}
        </motion.ul>
      ) : null}
    </motion.header>
  );
}

export default Nav;
