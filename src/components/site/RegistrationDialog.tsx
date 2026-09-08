import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { playCue } from "../../lib/sound";

export const EVENTS = [
  "Hackathon",
  "Robo Wars",
  "AI Challenge",
  "Code Sprint",
  "Gaming Arena",
  "Innovation Expo",
] as const;

const registrationSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  college: z.string().trim().min(2, "Enter your college name").max(150),
  email: z.string().trim().email("Enter a valid email address").max(255),
  event: z.enum(EVENTS, { message: "Choose an event" }),
});

type Fields = z.infer<typeof registrationSchema>;
type Errors = Partial<Record<keyof Fields, string>>;

export function RegistrationDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [fields, setFields] = useState<Fields>({
    name: "",
    college: "",
    email: "",
    event: EVENTS[0],
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const set = (key: keyof Fields, value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setServerError(null);
  };

  const close = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      setServerError(null);
      // let the exit animation finish before resetting the success view
      setTimeout(() => {
        setDone(false);
        setFields({ name: "", college: "", email: "", event: EVENTS[0] });
        setErrors({});
      }, 300);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = registrationSchema.safeParse(fields);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Fields;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setSubmitting(true);
    playCue("hover");
    const { error } = await supabase.from("registrations").insert(parsed.data);
    setSubmitting(false);
    if (error) {
      setServerError("Something went wrong while saving. Please try again.");
      return;
    }
    playCue("enter");
    setDone(true);
  };

  const fieldClass =
    "mt-1.5 border-border/70 bg-background/60 focus-visible:ring-primary";
  const errorText = (key: keyof Fields) =>
    errors[key] ? (
      <p className="mt-1 text-[11px] text-destructive">{errors[key]}</p>
    ) : null;

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="glass glow-border border-border/70 sm:max-w-md">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center py-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
                className="glow-ring flex h-16 w-16 items-center justify-center rounded-full bg-[image:var(--gradient-neon)] font-display text-2xl text-primary-foreground"
              >
                ✓
              </motion.div>
              <h3 className="neon-text mt-6 font-display text-2xl font-black">
                YOU'RE IN
              </h3>
              <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                Registration received for {fields.event}. We'll send details to{" "}
                <span className="text-foreground">{fields.email}</span>.
              </p>
              <button
                type="button"
                onClick={() => close(false)}
                className="mt-8 rounded-full border border-primary/60 px-8 py-2.5 font-display text-xs tracking-[0.25em] text-primary uppercase transition-colors hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                Done
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle className="neon-text font-display text-xl font-black tracking-wide">
                  REGISTER FOR TECHFEST 2026
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Enter the future — pick your event and lock in your spot.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
                <div>
                  <Label htmlFor="reg-name">Full name</Label>
                  <Input
                    id="reg-name"
                    autoComplete="name"
                    placeholder="Aarav Sharma"
                    value={fields.name}
                    onChange={(e) => set("name", e.target.value)}
                    className={fieldClass}
                    maxLength={100}
                  />
                  {errorText("name")}
                </div>

                <div>
                  <Label htmlFor="reg-college">College</Label>
                  <Input
                    id="reg-college"
                    autoComplete="organization"
                    placeholder="National Institute of Technology"
                    value={fields.college}
                    onChange={(e) => set("college", e.target.value)}
                    className={fieldClass}
                    maxLength={150}
                  />
                  {errorText("college")}
                </div>

                <div>
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@college.edu"
                    value={fields.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={fieldClass}
                    maxLength={255}
                  />
                  {errorText("email")}
                </div>

                <div>
                  <Label htmlFor="reg-event">Event</Label>
                  <Select
                    value={fields.event}
                    onValueChange={(v) => set("event", v)}
                  >
                    <SelectTrigger
                      id="reg-event"
                      className="mt-1.5 w-full border-border/70 bg-background/60 focus:ring-primary"
                    >
                      <SelectValue placeholder="Choose an event" />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENTS.map((ev) => (
                        <SelectItem key={ev} value={ev}>
                          {ev}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errorText("event")}
                </div>

                {serverError && (
                  <p className="text-xs text-destructive">{serverError}</p>
                )}

                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={submitting ? {} : { scale: 1.02 }}
                  whileTap={submitting ? {} : { scale: 0.97 }}
                  className="glow-ring mt-2 w-full rounded-full bg-[image:var(--gradient-neon)] px-8 py-3 font-display text-xs tracking-[0.3em] text-primary-foreground uppercase transition-opacity disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  {submitting ? "Submitting…" : "Confirm Registration"}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
