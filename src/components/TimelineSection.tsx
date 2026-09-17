import { useState } from "react";
import { Rocket, Cpu, Satellite, Calendar, MapPin } from "lucide-react";
import { soundFx } from "../lib/soundFx";
import type { OsMode } from "../lib/hooks";
import type { ExperienceItem, MilestoneType } from "../types/portfolio";

interface TimelineSectionProps {
  experience: ExperienceItem[];
  mode: OsMode;
}

const MODE_HEADING: Record<OsMode, string> = {
  neural: "Section 03 · Memory Timeline",
  orbital: "Section 03 · Mission Timeline",
  os: "Section 03 · System Log",
};

export function TimelineSection({ experience, mode }: TimelineSectionProps) {
  const [filter, setFilter] = useState<"all" | MilestoneType>("all");

  const setF = (f: "all" | MilestoneType) => {
    setFilter(f);
    soundFx.playCircuitProbe();
  };

  return (
    <section id="timeline" className="relative z-10 border-t px-4 py-24 sm:px-6" style={{ borderColor: "var(--border-soft)" }}>
      <div className="mx-auto max-w-[1160px]">
        <header className="reveal mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-2 flex items-center gap-2 font-mono text-[11px]" style={{ color: "var(--c-primary)" }}>
              <Satellite className="h-4 w-4" /> {MODE_HEADING[mode]}
            </div>
            <h2 className="headline text-3xl sm:text-4xl md:text-5xl">
              <span className="gradient-text">8+ years of engineering orbit</span>
            </h2>
            <p className="mt-3 text-[15px]" style={{ color: "var(--c-text-dim)" }}>
              Reverse-chronological trajectory across fintech, transit, and health mobile systems.
            </p>
          </div>

          {/* filter */}
          <div className="flex items-center gap-1 rounded-xl border p-1 font-mono text-[11px]" style={{ borderColor: "var(--border-soft)", background: "var(--bg-panel)" }}>
            {([["all", "ALL"], ["shipped", "SHIPPED"], ["architecture", "ARCH"]] as const).map(([val, lab]) => {
              const on = filter === val;
              return (
                <button
                  key={val}
                  onClick={() => setF(val)}
                  aria-pressed={on}
                  className="rounded-lg px-3 py-1.5 font-semibold uppercase tracking-wide transition-all"
                  style={{
                    color: on ? "var(--bg-void)" : "var(--c-text-dim)",
                    background: on ? "var(--c-primary)" : "transparent",
                  }}
                >
                  {lab}
                </button>
              );
            })}
          </div>
        </header>

        {/* timeline rail */}
        <div className="relative space-y-8 pl-8 sm:pl-12">
          <span
            className="absolute bottom-4 left-2.5 top-3 w-px sm:left-4"
            style={{ background: "linear-gradient(to bottom, var(--c-primary), var(--c-secondary), transparent)" }}
          />

          {experience.map((entry, idx) => {
            const milestones = entry.milestones.filter((m) => filter === "all" || m.type === filter);
            return (
              <div key={entry.id} className="reveal relative">
                {/* node */}
                <span
                  className="absolute -left-[26px] top-6 grid h-5 w-5 place-items-center rounded-full border-2 sm:-left-[38px]"
                  style={{
                    borderColor: idx === 0 ? "var(--c-primary)" : "var(--border-mid)",
                    background: "var(--bg-void)",
                    boxShadow: idx === 0 ? "var(--glow-primary)" : "none",
                  }}
                >
                  <span className={idx === 0 ? "live-blink" : ""} style={{ width: 7, height: 7, borderRadius: "50%", background: idx === 0 ? "var(--c-primary)" : "var(--c-text-mute)" }} />
                </span>

                <div className="glass holo-frame rounded-2xl p-5 sm:p-6">
                  <div className="flex flex-col justify-between gap-2 border-b pb-4 sm:flex-row sm:items-center" style={{ borderColor: "var(--border-soft)" }}>
                    <div>
                      <h3 className="font-display text-lg font-bold sm:text-xl" style={{ color: "var(--c-text)" }}>{entry.role}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[12px]" style={{ color: "var(--c-text-dim)" }}>
                        <span style={{ color: "var(--c-primary)" }} className="font-semibold">{entry.company}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {entry.location}</span>
                      </div>
                    </div>
                    <span className="flex w-fit items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[11px] font-semibold" style={{ borderColor: "var(--border-soft)", color: "var(--c-signal)" }}>
                      <Calendar className="h-3 w-3" /> {entry.dates}
                    </span>
                  </div>

                  <p className="mt-4 text-[13.5px] leading-relaxed" style={{ color: "var(--c-text-dim)" }}>{entry.summary}</p>

                  <div className="mt-4 space-y-2.5">
                    {milestones.map((m, mi) => (
                      <div key={mi} className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-start" style={{ borderColor: "var(--border-soft)", background: "var(--bg-panel)" }}>
                        <span
                          className="flex w-fit shrink-0 items-center gap-1.5 rounded px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide"
                          style={
                            m.type === "shipped"
                              ? { background: "color-mix(in srgb, var(--c-signal) 18%, transparent)", color: "var(--c-signal)" }
                              : { background: "color-mix(in srgb, var(--c-primary) 18%, transparent)", color: "var(--c-primary)" }
                          }
                        >
                          {m.type === "shipped" ? <><Rocket className="h-3 w-3" /> SHIPPED</> : <><Cpu className="h-3 w-3" /> ARCH</>}
                        </span>
                        <p className="text-[13px] leading-relaxed" style={{ color: "var(--c-text)" }}>{m.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t pt-4" style={{ borderColor: "var(--border-soft)" }}>
                    <span className="mr-1 font-mono text-[10px]" style={{ color: "var(--c-text-mute)" }}>STACK //</span>
                    {entry.stack.map((s) => (
                      <span key={s} className="rounded border px-2 py-0.5 font-mono text-[10.5px]" style={{ borderColor: "var(--border-soft)", color: "var(--c-text-dim)" }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
