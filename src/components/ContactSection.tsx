import { useState } from "react";
import { Mail, Calendar, Copy, Check, ShieldCheck, ArrowUpRight, Sparkles, Download, Radio } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons";
import { soundFx } from "../lib/soundFx";
import type { OsMode } from "../lib/hooks";
import type { ProfileData } from "../types/portfolio";

interface ContactSectionProps {
  profile: ProfileData;
  mode: OsMode;
  onDownloadResume: () => void;
}

const MODE_HEAD: Record<OsMode, string> = {
  neural: "Establish a neural link",
  orbital: "Open a comms channel",
  os: "Launch a new session",
};

export function ContactSection({ profile, mode, onDownloadResume }: ContactSectionProps) {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    soundFx.playArcadeCoin();
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* ignore */
    }
  };

  return (
    <section id="contact" className="relative z-10 border-t px-4 py-24 sm:px-6" style={{ borderColor: "var(--border-soft)" }}>
      <div className="mx-auto max-w-[1160px]">
        <div className="reveal glass-strong holo-frame scanline-panel relative overflow-hidden rounded-3xl p-8 sm:p-12">
          {/* ambient radar/neural ornament */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 opacity-40">
            <div className="radar-ring" style={{ inset: "0%" }} />
            <div className="radar-ring" style={{ inset: "18%" }} />
            <div className="radar-ring" style={{ inset: "36%" }} />
            <div className="radar-sweep" />
          </div>

          <div className="relative">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest" style={{ borderColor: "var(--border-mid)", color: "var(--c-signal)", background: "color-mix(in srgb, var(--c-signal) 8%, transparent)" }}>
                <span className="live-blink h-2 w-2 rounded-full" style={{ background: "var(--c-signal)" }} />
                Channel Open · Response &lt; 24h
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[11px]" style={{ color: "var(--c-text-mute)" }}>
                <Radio className="h-3.5 w-3.5" style={{ color: "var(--c-primary)" }} /> {profile.location}
              </span>
            </div>

            <h2 className="headline text-3xl sm:text-4xl md:text-5xl">
              <span className="gradient-text">{MODE_HEAD[mode]}</span>
            </h2>
            <p className="mt-3 max-w-2xl text-[16px]" style={{ color: "var(--c-text-dim)" }}>
              {profile.availability}. I'm most reachable by email — direct, no forms. I reply to every serious inquiry.
            </p>

            <div className="mt-5 flex items-start gap-3 rounded-xl border p-4" style={{ borderColor: "var(--border-soft)", background: "var(--bg-panel)" }}>
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--c-primary)" }} />
              <p className="font-mono text-[12.5px]" style={{ color: "var(--c-text-dim)" }}>
                <span style={{ color: "var(--c-primary)" }}>TRUST SIGNAL // </span>
                {profile.trustSignal}
              </p>
            </div>

            {/* primary actions */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a href={`mailto:${profile.email}`} onClick={() => soundFx.playPlasmaCharge()} className="btn-primary !py-3.5 !text-[14px]">
                <Mail className="h-4 w-4" />
                {profile.email}
              </a>
              <button onClick={copyEmail} className="btn-ghost !py-3.5" aria-label="Copy email">
                {copied ? <Check className="h-4 w-4" style={{ color: "var(--c-signal)" }} /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <a href={profile.calendly} target="_blank" rel="noreferrer" onClick={() => soundFx.playSynthwaveLaser()} className="btn-ghost !py-3.5">
                <Calendar className="h-4 w-4" />
                Book architecture call
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* secondary channels */}
            <div className="mt-6 flex flex-wrap items-center gap-2 border-t pt-6" style={{ borderColor: "var(--border-soft)" }}>
              <span className="mr-1 font-mono text-[10px]" style={{ color: "var(--c-text-mute)" }}>CHANNELS //</span>
              <a href={profile.github} target="_blank" rel="noreferrer" onClick={() => soundFx.playCircuitProbe()} className="flex items-center gap-2 rounded-lg border px-3.5 py-2 font-mono text-[12px] transition-colors hover:opacity-80" style={{ borderColor: "var(--border-soft)", color: "var(--c-text)" }}>
                <GithubIcon className="h-4 w-4" /> GitHub <ArrowUpRight className="h-3 w-3" style={{ color: "var(--c-text-mute)" }} />
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" onClick={() => soundFx.playCircuitProbe()} className="flex items-center gap-2 rounded-lg border px-3.5 py-2 font-mono text-[12px] transition-colors hover:opacity-80" style={{ borderColor: "var(--border-soft)", color: "var(--c-text)" }}>
                <LinkedinIcon className="h-4 w-4" /> LinkedIn <ArrowUpRight className="h-3 w-3" style={{ color: "var(--c-text-mute)" }} />
              </a>
              <a href={profile.gravatar} target="_blank" rel="noreferrer" onClick={() => soundFx.playCircuitProbe()} className="flex items-center gap-2 rounded-lg border px-3.5 py-2 font-mono text-[12px] transition-colors hover:opacity-80" style={{ borderColor: "var(--border-soft)", color: "var(--c-text)" }}>
                <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--c-primary)" }} /> Gravatar <ArrowUpRight className="h-3 w-3" style={{ color: "var(--c-text-mute)" }} />
              </a>
              <button onClick={onDownloadResume} className="ml-auto flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-[12px] font-bold" style={{ background: "var(--c-text)", color: "var(--bg-void)" }}>
                <Download className="h-4 w-4" /> Résumé
              </button>
            </div>
          </div>
        </div>

        {/* footer */}
        <footer className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 font-mono text-[11px] sm:flex-row" style={{ borderColor: "var(--border-soft)", color: "var(--c-text-mute)" }}>
          <span>© 2026 {profile.name} · Senior Android Engineer</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full live-blink" style={{ background: "var(--c-signal)" }} />
            NEURAL COMMAND OS · v3.0 · {mode.toUpperCase()} LAYER
          </span>
        </footer>
      </div>
    </section>
  );
}
