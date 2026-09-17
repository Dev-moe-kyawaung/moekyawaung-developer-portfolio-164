import { ArrowDown, Cpu, Sparkles, Radio, Activity, ShieldCheck, MapPin, ChevronRight } from "lucide-react";
import { soundFx } from "../lib/soundFx";
import type { OsMode } from "../lib/hooks";
import type { ProfileData, TickerMetric } from "../types/portfolio";

interface CommandDeckProps {
  profile: ProfileData;
  ticker: TickerMetric[];
  mode: OsMode;
  onOpenAssistant: () => void;
}

const MODE_COPY: Record<OsMode, { tag: string; lead: string; accentWord: string }> = {
  neural: {
    tag: "Neural Bio-Link · Living Interface",
    lead: "Senior Android systems that think",
    accentWord: "in synapses.",
  },
  orbital: {
    tag: "Orbital Command · Mission Telemetry",
    lead: "Senior Android systems engineered for",
    accentWord: "flight-grade reliability.",
  },
  os: {
    tag: "Developer OS · Holographic Workspace",
    lead: "Senior Android systems, composed as",
    accentWord: "living windows.",
  },
};

function CentralVisual({ mode, avatar }: { mode: OsMode; avatar: string }) {
  return (
    <div className="relative mx-auto flex h-[320px] w-[320px] items-center justify-center sm:h-[380px] sm:w-[380px]">
      {/* shared aura */}
      <div
        className="absolute inset-8 rounded-full blur-2xl"
        style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--c-primary) 30%, transparent), transparent 70%)" }}
      />

      {mode === "orbital" && (
        <>
          {[0.55, 0.75, 0.95].map((s, i) => (
            <div
              key={i}
              className="orbit-path"
              style={{
                width: `${s * 100}%`,
                height: `${s * 100}%`,
                animation: `orbit-spin ${14 + i * 8}s linear infinite ${i % 2 ? "reverse" : ""}`,
              }}
            >
              <span className="orbit-satellite" />
            </div>
          ))}
          <div className="radar-ring" style={{ inset: "12%" }} />
          <div className="radar-ring" style={{ inset: "26%" }} />
        </>
      )}

      {mode === "neural" && (
        <>
          {[...Array(6)].map((_, i) => {
            const ang = (i / 6) * Math.PI * 2;
            return (
              <span
                key={i}
                className="synapse-node absolute h-3 w-3 rounded-full"
                style={{
                  left: `${50 + Math.cos(ang) * 42}%`,
                  top: `${50 + Math.sin(ang) * 42}%`,
                  background: i % 2 ? "var(--c-secondary)" : "var(--c-primary)",
                  boxShadow: "var(--glow-soft)",
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            );
          })}
          <div className="radar-ring bio-breathe" style={{ inset: "18%", borderStyle: "dashed" }} />
        </>
      )}

      {mode === "os" && (
        <>
          <div className="absolute left-[8%] top-[14%] h-24 w-32 rounded-lg glass float-organic" style={{ animationDelay: "0s" }} />
          <div className="absolute right-[6%] top-[30%] h-20 w-28 rounded-lg glass float-organic" style={{ animationDelay: "1.5s" }} />
          <div className="absolute bottom-[12%] left-[18%] h-16 w-24 rounded-lg glass float-organic" style={{ animationDelay: "3s" }} />
        </>
      )}

      {/* rotating conic ring */}
      <div
        className="absolute inset-[14%] rounded-full"
        style={{
          background: "conic-gradient(from 0deg, transparent, color-mix(in srgb, var(--c-primary) 40%, transparent), transparent 40%)",
          animation: "orbit-spin 8s linear infinite",
          maskImage: "radial-gradient(circle, transparent 60%, #000 62%, #000 68%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(circle, transparent 60%, #000 62%, #000 68%, transparent 70%)",
        }}
      />

      {/* core avatar */}
      <div
        className="bio-breathe relative z-10 h-40 w-40 overflow-hidden rounded-full border-2 sm:h-48 sm:w-48"
        style={{ borderColor: "var(--c-primary)", boxShadow: "var(--glow-primary)" }}
      >
        <img
          src={avatar}
          alt="Moe Kyaw Aung"
          className="h-full w-full object-cover"
          style={{ mixBlendMode: "luminosity" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, color-mix(in srgb, var(--c-primary) 35%, transparent))" }} />
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 3px)" }}
        />
      </div>

      {/* HUD readouts */}
      <span className="glass absolute left-0 top-6 rounded-md px-2 py-1 font-mono text-[9px]" style={{ color: "var(--c-primary)" }}>
        SYS: ONLINE
      </span>
      <span className="glass absolute bottom-8 right-0 rounded-md px-2 py-1 font-mono text-[9px]" style={{ color: "var(--c-signal)" }}>
        LINK: 100%
      </span>
    </div>
  );
}

export function CommandDeck({ profile, ticker, mode, onOpenAssistant }: CommandDeckProps) {
  const copy = MODE_COPY[mode];

  return (
    <section id="deck" className="relative min-h-screen px-4 pt-28 pb-16 sm:px-6">
      <div className="mx-auto max-w-[1320px]">
        {/* status strip */}
        <div className="reveal in mb-8 flex flex-wrap items-center justify-between gap-3">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5">
            <span className="live-blink h-2 w-2 rounded-full" style={{ background: "var(--c-signal)" }} />
            <span className="label-mono text-[10px]" style={{ color: "var(--c-primary)" }}>{copy.tag}</span>
          </span>
          <div className="flex items-center gap-4 font-mono text-[11px]" style={{ color: "var(--c-text-mute)" }}>
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" style={{ color: "var(--c-primary)" }} /> {profile.location}</span>
            <span className="hidden items-center gap-1.5 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--c-signal)" }} /> AVAILABLE
            </span>
          </div>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          {/* copy */}
          <div>
            <div className="reveal in reveal-delay-1 mb-4 flex items-center gap-2 font-mono text-[12px]" style={{ color: "var(--c-primary)" }}>
              <Cpu className="h-4 w-4" />
              {profile.title}
            </div>

            <h1 className="reveal in reveal-delay-1 headline text-4xl sm:text-5xl md:text-6xl">
              {copy.lead}
              <br />
              <span className="gradient-text">{copy.accentWord}</span>
            </h1>

            <p className="reveal in reveal-delay-2 mt-6 max-w-xl text-[16px] leading-relaxed sm:text-[17px]" style={{ color: "var(--c-text-dim)" }}>
              {profile.positioning} Every module here is a live node in a single command interface — switch the neural, orbital, and OS layers from the top bar.
            </p>

            {/* competency chips */}
            <div className="reveal in reveal-delay-2 mt-6 flex flex-wrap gap-2">
              {["Kotlin 2.0", "Jetpack Compose", "Offline-First", "GTFS-Realtime", "StrongBox Security", "On-Device AI"].map((c) => (
                <span
                  key={c}
                  className="glass rounded-full px-3 py-1 font-mono text-[11px]"
                  style={{ color: "var(--c-text-dim)", borderColor: "var(--border-soft)" }}
                >
                  {c}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="reveal in reveal-delay-3 mt-8 flex flex-wrap items-center gap-3">
              <a href="#clusters" className="btn-primary" onClick={() => soundFx.playPlasmaCharge()}>
                Explore Systems
                <ArrowDown className="h-4 w-4" />
              </a>
              <button onClick={() => { onOpenAssistant(); soundFx.playPlasmaCharge(); }} className="btn-ghost">
                <Sparkles className="h-4 w-4" />
                {mode === "neural" ? "Wake the Organism" : mode === "orbital" ? "Hail Mission Op" : "Boot System Bot"}
              </button>
            </div>
          </div>

          {/* central visual */}
          <div className="reveal in reveal-delay-2">
            <CentralVisual mode={mode} avatar={profile.avatarUrl} />
          </div>
        </div>

        {/* telemetry strip */}
        <div className="reveal in reveal-delay-3 mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {ticker.map((m, i) => (
            <div key={m.id} className="glass holo-frame scanline-panel rounded-xl p-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="label-mono text-[9px]">{mode === "orbital" ? `TLM-0${i + 1}` : mode === "neural" ? `SYN-0${i + 1}` : `WIN-0${i + 1}`}</span>
                <Activity className="h-3 w-3" style={{ color: "var(--c-primary)" }} />
              </div>
              <div className="font-display text-2xl font-bold" style={{ color: "var(--c-text)" }}>{m.value}</div>
              <div className="mt-0.5 font-mono text-[11px]" style={{ color: "var(--c-text-mute)" }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* trust bar */}
        <div className="reveal mt-6 flex flex-wrap items-center gap-3 rounded-xl glass px-4 py-3">
          <ShieldCheck className="h-4 w-4 shrink-0" style={{ color: "var(--c-signal)" }} />
          <p className="font-mono text-[12px]" style={{ color: "var(--c-text-dim)" }}>
            <span style={{ color: "var(--c-primary)" }}>TRUST SIGNAL // </span>
            {profile.trustSignal}
          </p>
          <a href="#clusters" className="ml-auto hidden items-center gap-1 font-mono text-[11px] sm:flex" style={{ color: "var(--c-primary)" }}>
            SCROLL TO DECODE <ChevronRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* subtle mode indicator */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 font-mono text-[10px]" style={{ color: "var(--c-text-mute)" }}>
        <Radio className="h-3 w-3 live-blink" style={{ color: "var(--c-primary)" }} />
        <span>{mode.toUpperCase()} LAYER ACTIVE</span>
      </div>
    </section>
  );
}
