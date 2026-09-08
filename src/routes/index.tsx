import { createFileRoute } from "@tanstack/react-router";
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
  return (
    <main className="relative min-h-screen bg-background">
      <Nav />
      <Hero />
      <About />
      <Events />
      <Domains />
      <Timeline />
      <Stats />
      <FinalCta />
      <Footer />
    </main>
  );
}
