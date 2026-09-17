import { useEffect, useMemo, useState } from "react";
import { BrainCircuit, Radar, AppWindow, Menu, X, Volume2, VolumeX, Download } from "lucide-react";
import { soundFx } from "../lib/soundFx";
import { useMissionClock, useScrollSpy, type OsMode } from "../lib/hooks";
import type { ProfileData } from "../types/portfolio";

interface CommandBarProps {
  profile: ProfileData;
  mode: OsMode;
  onModeChange: (m: OsMode) => void;
  onDownloadResume: () => void;
}

const SECTIONS = [
  { id: "clusters", label: "Projects" },
  { id: "decisions", label: "Decisions" },
  { id: "timeline", label: "Timeline" },
  { id: "contact", label: "Contact" },
];

const MODES: { id: OsMode; label: string; icon: typeof Radar }[] = [
  { id: "neural", label: "Neural", icon: BrainCircuit },
  { id: "orbital", label: "Orbital", icon: Radar },
  { id: "os", label: "OS", icon: AppWindow },
];

export function CommandBar({ profile, mode, onModeChange, onDownloadResume }: CommandBarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sfxOn, setSfxOn] = useState(soundFx.enabled);
  const ids = useMemo(() => SECTIONS.map((s) => s.id), []);
  const active = useScrollSpy(ids);
  const clock = useMissionClock();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const time = clock.toISOString().slice(11, 19);

  const handleMode = (m: OsMode) => {
    onModeChange(m);
    soundFx.playCircuitProbe();
  };

  const toggleSfx = () => setSfxOn(soundFx.toggle());

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? "glass-strong border-b" : "border-b border-transparent"
      }`}
      style={{ borderColor: scrolled ? "var(--border-soft)" : "transparent" }}
    >
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-4 px-4 sm:px-6">
        {/* Identity */}
        <a href="#deck" className="group flex items-center gap-3" onClick={() => soundFx.playPlasmaBurst()}>
          <span
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border"
            style={{ borderColor: "var(--border-mid)", background: "color-mix(in srgb, var(--c-primary) 12%, transparent)" }}
          >
            <span className="synapse-node h-2.5 w-2.5 rounded-full" style={{ background: "var(--c-primary)", boxShadow: "var(--glow-primary)" }} />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[14px] font-bold" style={{ color: "var(--c-text)" }}>
              {profile.name}
            </span>
            <span className="label-mono block text-[9px]">NEURAL COMMAND OS</span>
          </span>
        </a>

        {/* Section nav */}
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => soundFx.playCircuitProbe()}
              className="rounded-lg px-3 py-1.5 font-tech text-[13px] transition-colors"
              style={{
                color: active === s.id ? "var(--c-primary)" : "var(--c-text-dim)",
                background: active === s.id ? "color-mix(in srgb, var(--c-primary) 10%, transparent)" : "transparent",
              }}
            >
              {s.label}
            </a>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* mission clock */}
          <div className="hidden items-center gap-2 rounded-lg border px-2.5 py-1.5 xl:flex" style={{ borderColor: "var(--border-soft)" }}>
            <span className="live-blink h-1.5 w-1.5 rounded-full" style={{ background: "var(--c-signal)" }} />
            <span className="font-mono text-[11px] tabular-nums" style={{ color: "var(--c-text-dim)" }}>
              {time} UTC
            </span>
          </div>

          {/* mode switch */}
          <div className="flex items-center gap-0.5 rounded-xl border p-1" style={{ borderColor: "var(--border-soft)", background: "var(--bg-panel)" }}>
            {MODES.map((m) => {
              const Icon = m.icon;
              const on = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleMode(m.id)}
                  title={`${m.label} mode`}
                  aria-pressed={on}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-tech text-[11px] font-semibold uppercase tracking-wide transition-all"
                  style={{
                    color: on ? "var(--bg-void)" : "var(--c-text-dim)",
                    background: on ? "var(--c-primary)" : "transparent",
                    boxShadow: on ? "var(--glow-soft)" : "none",
                  }}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{m.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={toggleSfx}
            title={sfxOn ? "Mute audio" : "Enable audio"}
            aria-label="Toggle audio"
            className="grid h-9 w-9 place-items-center rounded-lg border transition-colors"
            style={{ borderColor: "var(--border-soft)", color: sfxOn ? "var(--c-primary)" : "var(--c-text-mute)" }}
          >
            {sfxOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          <button
            onClick={onDownloadResume}
            className="btn-ghost hidden !py-2 !text-[12px] sm:inline-flex"
          >
            <Download className="h-3.5 w-3.5" />
            Resume
          </button>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="grid h-9 w-9 place-items-center rounded-lg border lg:hidden"
            style={{ borderColor: "var(--border-soft)", color: "var(--c-text)" }}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav aria-label="Mobile" className="glass-strong border-t px-4 py-3 lg:hidden" style={{ borderColor: "var(--border-soft)" }}>
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => setMenuOpen(false)}
              className="block border-b py-3 font-tech text-[14px] last:border-0"
              style={{ color: "var(--c-text)", borderColor: "var(--border-soft)" }}
            >
              {s.label}
            </a>
          ))}
          <button onClick={() => { setMenuOpen(false); onDownloadResume(); }} className="btn-ghost mt-3 w-full justify-center">
            <Download className="h-4 w-4" /> Download Resume
          </button>
        </nav>
      )}
    </header>
  );
}
