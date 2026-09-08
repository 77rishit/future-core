// Sound-ready structure. Nothing autoplays; audio only unlocks after a user gesture
// and stays silent until enabled (e.g. via a future mute toggle).

type CueName = "hover" | "enter" | "whoosh";

let ctx: AudioContext | null = null;
let enabled = false;

export function isSoundEnabled() {
  return enabled;
}

/** Call from a user gesture (click/tap) only. */
export function unlockAudio() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function setSoundEnabled(next: boolean) {
  enabled = next;
  if (next) unlockAudio();
}

/** Plays a short synthesized cue. Silent unless sound has been explicitly enabled. */
export function playCue(cue: CueName) {
  if (!enabled || !ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const settings: Record<CueName, { f: number; to: number; d: number; v: number }> = {
    hover: { f: 880, to: 1120, d: 0.08, v: 0.03 },
    enter: { f: 220, to: 660, d: 0.6, v: 0.08 },
    whoosh: { f: 120, to: 40, d: 1.2, v: 0.06 },
  };
  const s = settings[cue];
  osc.type = "sine";
  osc.frequency.setValueAtTime(s.f, now);
  osc.frequency.exponentialRampToValueAtTime(s.to, now + s.d);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(s.v, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + s.d);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + s.d + 0.05);
}
