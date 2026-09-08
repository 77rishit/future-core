export type EventDetail = {
  slug: string;
  name: string;
  tag: string;
  desc: string;
  tagline: string;
  overview: string;
  format: string;
  teamSize: string;
  prize: string;
  venue: string;
  rules: string[];
  schedule: { time: string; title: string; body: string }[];
  register: string[];
};

export const eventDetails: EventDetail[] = [
  {
    slug: "hackathon",
    name: "Hackathon",
    tag: "36 HRS",
    desc: "Build a working product overnight with mentors on the floor.",
    tagline: "36 hours. One idea. A working product.",
    overview:
      "The flagship build marathon of TECHFEST 2026. Teams ship a functional prototype around a theme revealed at kickoff, with mentors from industry on the floor all night.",
    format: "36-hour on-campus build sprint",
    teamSize: "2 – 4 members",
    prize: "₹1,50,000 pool",
    venue: "Innovation Hall, Block A",
    rules: [
      "All code must be written during the event; boilerplate and open-source libraries are allowed if declared at kickoff.",
      "Teams of 2 to 4. Cross-college teams are welcome.",
      "The problem theme is revealed at the opening ceremony — no pre-built solutions.",
      "Commit to a public repository throughout; judges review commit history.",
      "Final demo is 5 minutes plus 3 minutes of questions.",
      "Judging: functionality 35%, innovation 25%, technical depth 25%, presentation 15%.",
    ],
    schedule: [
      { time: "Day 1 · 09:00", title: "Check-in & kickoff", body: "Team verification and theme reveal." },
      { time: "Day 1 · 10:30", title: "Build begins", body: "Mentor desks open across all tracks." },
      { time: "Day 1 · 21:00", title: "Checkpoint I", body: "Progress review with assigned mentors." },
      { time: "Day 2 · 12:00", title: "Checkpoint II", body: "Feature freeze guidance and demo prep." },
      { time: "Day 2 · 21:00", title: "Code freeze", body: "Repositories locked for evaluation." },
      { time: "Day 3 · 10:00", title: "Demos & results", body: "Final pitches before the jury panel." },
    ],
    register: [
      "Pick Hackathon in the registration form and submit your details.",
      "One member registers on behalf of the team; you will confirm teammates by email.",
      "Registration closes February 20, or earlier once 120 teams are confirmed.",
      "Bring your own laptops and hardware; power, network and food are provided.",
    ],
  },
  {
    slug: "robo-wars",
    name: "Robo Wars",
    tag: "ARENA",
    desc: "Steel, servos and sparks in the combat cage.",
    tagline: "Steel, servos and sparks in the combat cage.",
    overview:
      "A knockout combat tournament inside a fully enclosed arena. Custom-built bots battle for control, damage and survival across timed rounds.",
    format: "Single-elimination bracket, 3-minute rounds",
    teamSize: "3 – 5 members",
    prize: "₹1,00,000 pool",
    venue: "Arena Ground, North Campus",
    rules: [
      "Maximum bot weight is 15 kg including all weapons and batteries.",
      "Only sealed batteries (LiPo, NiMH, SLA) are permitted; IC engines are banned.",
      "No liquid, flame, projectile, EMP or entanglement weapons.",
      "Wireless control must use unique frequency binding; failsafe cut-off is mandatory.",
      "A bot immobile for 10 continuous seconds is counted as knocked out.",
      "Every bot clears safety inspection before it enters the arena.",
    ],
    schedule: [
      { time: "Day 1 · 09:00", title: "Safety inspection", body: "Weight, wiring and failsafe checks." },
      { time: "Day 1 · 13:00", title: "Qualifying runs", body: "Mobility and control tests in the cage." },
      { time: "Day 2 · 10:00", title: "Round of 16", body: "First knockout bouts." },
      { time: "Day 2 · 16:00", title: "Quarter finals", body: "Repair window of 30 minutes between bouts." },
      { time: "Day 3 · 11:00", title: "Semi finals", body: "Best of three format." },
      { time: "Day 3 · 17:00", title: "Grand final", body: "Championship bout and awards." },
    ],
    register: [
      "Pick Robo Wars in the registration form and submit your details.",
      "Email your bot specification sheet when we reply to your confirmation.",
      "Teams must arrive with a spare set of batteries and basic repair tools.",
      "Registration closes February 20; the bracket is capped at 32 bots.",
    ],
  },
  {
    slug: "ai-challenge",
    name: "AI Challenge",
    tag: "MODELS",
    desc: "Train, fine-tune and ship intelligence under pressure.",
    tagline: "Train, fine-tune and ship intelligence under pressure.",
    overview:
      "A two-stage machine learning contest. Qualify on a hidden leaderboard dataset, then defend your approach live with a fresh evaluation set on campus.",
    format: "Online leaderboard round + on-campus finals",
    teamSize: "1 – 3 members",
    prize: "₹75,000 pool",
    venue: "AI Lab, Block C",
    rules: [
      "Any open framework is allowed; the full training pipeline must be reproducible.",
      "Only publicly available or provided datasets may be used.",
      "Maximum of 8 leaderboard submissions per team per day.",
      "Finalists submit code and a one-page method note before the live round.",
      "Hosted API models are allowed only if disclosed in the method note.",
      "Scoring combines the private leaderboard metric with the jury's review of method quality.",
    ],
    schedule: [
      { time: "Feb 24 · 10:00", title: "Dataset release", body: "Online round opens with the public leaderboard." },
      { time: "Mar 01 · 23:59", title: "Leaderboard close", body: "Top 15 teams advance to finals." },
      { time: "Day 2 · 09:30", title: "Finals briefing", body: "Fresh evaluation set handed out." },
      { time: "Day 2 · 10:00", title: "Live round", body: "Six hours of on-site modelling." },
      { time: "Day 3 · 14:00", title: "Method defence", body: "10-minute technical review with judges." },
    ],
    register: [
      "Pick AI Challenge in the registration form and submit your details.",
      "Leaderboard credentials are emailed to the registered address before the dataset release.",
      "Solo entries are welcome; teams are capped at 3 members.",
      "Registration closes February 20.",
    ],
  },
  {
    slug: "code-sprint",
    name: "Code Sprint",
    tag: "3 HRS",
    desc: "Lightning-fast competitive programming rounds.",
    tagline: "Three hours. Eight problems. No mercy.",
    overview:
      "A classic ICPC-style contest. Solve algorithmic problems of escalating difficulty against a live scoreboard that freezes in the final half hour.",
    format: "3-hour individual contest, ICPC scoring",
    teamSize: "Individual",
    prize: "₹50,000 pool",
    venue: "Computing Centre, Block B",
    rules: [
      "Allowed languages: C++, Java, Python, Go and Rust.",
      "Only offline reference material and language documentation are permitted.",
      "No internet access, messaging or AI assistants during the contest.",
      "Wrong submissions carry a 20-minute penalty on the tie-break.",
      "The scoreboard freezes for the last 30 minutes.",
      "Any plagiarism detected results in immediate disqualification.",
    ],
    schedule: [
      { time: "Feb 24 · 19:00", title: "Practice round", body: "Optional 1-hour judge warm-up." },
      { time: "Day 1 · 14:00", title: "Reporting", body: "Seat allocation and environment check." },
      { time: "Day 1 · 15:00", title: "Contest begins", body: "Eight problems, three hours." },
      { time: "Day 1 · 17:30", title: "Scoreboard freeze", body: "Standings hidden until the finish." },
      { time: "Day 1 · 18:30", title: "Editorial & results", body: "Problem setters walk through solutions." },
    ],
    register: [
      "Pick Code Sprint in the registration form and submit your details.",
      "A judge handle is created for you and emailed before the practice round.",
      "Report 30 minutes early with your college ID.",
      "Registration closes February 20.",
    ],
  },
  {
    slug: "gaming-arena",
    name: "Gaming Arena",
    tag: "ESPORTS",
    desc: "LAN tournaments across the biggest titles.",
    tagline: "LAN tournaments across the biggest titles.",
    overview:
      "Campus esports at full volume — Valorant, BGMI and FIFA brackets played on tournament-grade LAN rigs with live casting on the main stage.",
    format: "LAN brackets across three titles",
    teamSize: "1 – 5 depending on title",
    prize: "₹80,000 pool",
    venue: "Esports Stage, Auditorium",
    rules: [
      "Titles: Valorant (5v5), BGMI (squads of 4) and FIFA (1v1).",
      "Official tournament rulesets and current patch settings apply.",
      "Peripherals may be brought; systems and monitors are provided.",
      "Teams must be on stand-by 15 minutes before a scheduled match.",
      "A no-show beyond 10 minutes is a forfeit.",
      "Cheats, macros and account sharing lead to a permanent ban from the fest.",
    ],
    schedule: [
      { time: "Day 1 · 11:00", title: "Check-in & seeding", body: "Roster lock and bracket draw." },
      { time: "Day 1 · 13:00", title: "Group stage", body: "Valorant and BGMI open lobbies." },
      { time: "Day 2 · 11:00", title: "FIFA brackets", body: "Single elimination through the day." },
      { time: "Day 2 · 18:00", title: "Semi finals", body: "Live casting on the main stage." },
      { time: "Day 3 · 16:00", title: "Grand finals", body: "Best of three across all titles." },
    ],
    register: [
      "Pick Gaming Arena in the registration form and submit your details.",
      "Mention your title and in-game IDs in the confirmation email reply.",
      "Rosters lock at check-in; one substitute per team is allowed.",
      "Registration closes February 20 or when brackets fill.",
    ],
  },
  {
    slug: "innovation-expo",
    name: "Innovation Expo",
    tag: "SHOWCASE",
    desc: "Demo your prototype to industry judges and investors.",
    tagline: "Put your prototype in front of the people who fund them.",
    overview:
      "An exhibition floor for working prototypes and research projects. Every stall is judged, and shortlisted teams pitch to a panel of investors and industry leaders.",
    format: "Exhibition floor + shortlisted pitch round",
    teamSize: "1 – 5 members",
    prize: "₹60,000 pool + incubation review",
    venue: "Expo Grounds, Central Lawn",
    rules: [
      "A working prototype or demonstrable proof of concept is required — slides alone are not accepted.",
      "Projects submitted to a previous edition of TECHFEST are not eligible.",
      "Each team gets one 2m x 2m stall with power and a display table.",
      "Stalls must be staffed during the full public viewing window.",
      "Pitch round is 6 minutes plus 4 minutes of questions.",
      "Judging: originality 30%, execution 30%, impact 25%, presentation 15%.",
    ],
    schedule: [
      { time: "Day 1 · 08:00", title: "Stall setup", body: "Load-in, power and display checks." },
      { time: "Day 1 · 11:00", title: "Public viewing", body: "Open floor for visitors and students." },
      { time: "Day 2 · 10:00", title: "Jury walkthrough", body: "Judges visit every stall in rotation." },
      { time: "Day 2 · 17:00", title: "Shortlist announced", body: "Top 10 projects move to the pitch round." },
      { time: "Day 3 · 12:00", title: "Investor pitches", body: "Final presentations and awards." },
    ],
    register: [
      "Pick Innovation Expo in the registration form and submit your details.",
      "Send a short project abstract when we reply to your confirmation.",
      "Bring your own display material; power and table are provided.",
      "Registration closes February 20; the floor is capped at 60 stalls.",
    ],
  },
];

export const getEvent = (slug: string) => eventDetails.find((e) => e.slug === slug);
