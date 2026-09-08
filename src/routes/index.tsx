import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import IntroGate from "../components/site/IntroGate";
import SceneCanvas from "../components/three/SceneCanvas";
import Nav from "../components/site/Nav";
import Hero from "../components/site/Hero";
import { About, Domains, Events, FinalCta, Footer, Stats, Timeline } from "../components/site/Sections";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "TECHFEST 2026 — Enter the Future" },
      {
        name: "description",
        content:
          "TECHFEST 2026: a three-day college techfest of hackathons, robo wars, AI challenges, gaming and innovation. Where technology meets imagination.",
      },
      { property: "og:title", content: "TECHFEST 2026 — Enter the Future" },
      {
        property: "og:description",
        content:
          "Hackathon, Robo Wars, AI Challenge, Code Sprint, Gaming Arena and Innovation Expo. Register for TECHFEST 2026.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [entered, setEntered] = useState(false);

  return (
    <main className="relative min-h-screen bg-background">
      <IntroGate onEnter={() => setEntered(true)} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: entered ? 1 : 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <SceneCanvas />
      </motion.div>
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 24 }}
        animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 1, delay: entered ? 0.2 : 0, ease: [0.22, 1, 0.36, 1] }}
      >
        <Nav />
        <Hero />
        <About />
        <Events />
        <Domains />
        <Timeline />
        <Stats />
        <FinalCta />
        <Footer />
      </motion.div>
    </main>
  );
}

