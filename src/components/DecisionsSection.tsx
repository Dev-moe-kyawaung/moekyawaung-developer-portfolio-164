import { useState } from "react";
import { Check, ChevronDown, GitBranch, Cpu, CornerDownRight, Zap } from "lucide-react";
import { soundFx } from "../lib/soundFx";
import type { OsMode } from "../lib/hooks";
import type { TradeoffItem } from "../types/portfolio";

interface DecisionsSectionProps {
  tradeoffs: TradeoffItem[];
  mode: OsMode;
}

const MODE_HEADING: Record<OsMode, { kicker: string; title: string }> = {
  neural: { kicker: "Section 02 · Cognitive Pathways", title: "How I decide — engineering RFCs" },
  orbital: { kicker: "Section 02 · Flight Directives", title: "How I decide — engineering RFCs" },
  os: { kicker: "Section 02 · System Config", title: "How I decide — engineering RFCs" },
};

export function DecisionsSection({ tradeoffs, mode }: DecisionsSectionProps) {
  const [openId, setOpenId] = useState<string | null>(tradeoffs[0]?.id ?? null);
  const h = MODE_HEADING[mode];

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
    soundFx.playCircuitProbe();
  };

  return (
    <section id="decisions" className="relative z-10 border-t px-4 py-24 sm:px-6" style={{ borderColor: "var(--border-soft)", background: "color-mix(in srgb, var(--bg-deep) 55%, transparent)" }}>
      <div className="mx-auto max-w-[1160px]">
        <header className="reveal mb-12 max-w-2xl">
          <div className="mb-2 flex items-center gap-2 font-mono text-[11px]" style={{ color: "var(--c-primary)" }}>
            <GitBranch className="h-4 w-4" /> {h.kicker}
          </div>
          <h2 className="headline text-3xl sm:text-4xl md:text-5xl">
            <span className="gradient-text">{h.title}</span>
          </h2>
          <p className="mt-3 text-[15px]" style={{ color: "var(--c-text-dim)" }}>
            Senior engineering is the trade-offs you can defend. Four production RFCs — context, options weighed, the call, and why.
          </p>
        </header>

        <div className="space-y-3">
          {tradeoffs.map((rfc) => {
            const open = openId === rfc.id;
            return (
              <div
                key={rfc.id}
                className="reveal glass holo-frame overflow-hidden rounded-2xl transition-all"
                style={{ borderColor: open ? "var(--border-strong)" : "var(--border-soft)" }}
              >
                <button
                  onClick={() => toggle(rfc.id)}
                  aria-expanded={open}
                  className="flex w-full items-start justify-between gap-4 p-5 text-left sm:items-center sm:p-6"
                >
                  <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="rounded border px-2 py-1 font-semibold" style={{ borderColor: "var(--border-mid)", color: "var(--c-primary)", background: "color-mix(in srgb, var(--c-primary) 10%, transparent)" }}>
                        {rfc.rfcNumber}
                      </span>
                      <span style={{ color: "var(--c-text-mute)" }}>{rfc.topic}</span>
                    </div>
                    <h3 className="font-display text-base font-bold sm:text-lg" style={{ color: "var(--c-text)" }}>
                      {rfc.title}
                    </h3>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="hidden rounded border px-2 py-1 font-mono text-[10px] md:inline-block" style={{ borderColor: "var(--border-soft)", color: "var(--c-signal)", background: "color-mix(in srgb, var(--c-signal) 8%, transparent)" }}>
                      {rfc.metricImpact}
                    </span>
                    <span
                      className="grid h-8 w-8 place-items-center rounded-lg border transition-transform"
                      style={{ borderColor: "var(--border-soft)", color: open ? "var(--c-primary)" : "var(--c-text-mute)", transform: open ? "rotate(180deg)" : "none" }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </div>
                </button>

                {open && (
                  <div className="border-t px-5 pb-6 pt-4 sm:px-6" style={{ borderColor: "var(--border-soft)" }}>
                    <div className="grid gap-6 lg:grid-cols-12">
                      <div className="space-y-5 lg:col-span-5">
                        <div>
                          <div className="mb-2 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--c-tertiary)" }}>
                            <Zap className="h-3 w-3" /> 01 · Context
                          </div>
                          <p className="rounded-lg border p-3 text-[13px] leading-relaxed" style={{ borderColor: "var(--border-soft)", background: "var(--bg-panel)", color: "var(--c-text-dim)" }}>
                            {rfc.context}
                          </p>
                        </div>
                        <div>
                          <div className="mb-2 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--c-primary)" }}>
                            <Cpu className="h-3 w-3" /> 02 · Options
                          </div>
                          <div className="space-y-2">
                            {rfc.options.map((opt) => (
                              <div
                                key={opt.name}
                                className="rounded-lg border p-3 text-[12.5px]"
                                style={{
                                  borderColor: opt.selected ? "var(--border-strong)" : "var(--border-soft)",
                                  background: opt.selected ? "color-mix(in srgb, var(--c-primary) 10%, transparent)" : "var(--bg-panel)",
                                }}
                              >
                                <div className="mb-1 flex items-center justify-between">
                                  <span className="font-mono font-bold" style={{ color: opt.selected ? "var(--c-primary)" : "var(--c-text)" }}>
                                    {opt.name}
                                  </span>
                                  {opt.selected ? (
                                    <span className="flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[9px] font-bold" style={{ background: "color-mix(in srgb, var(--c-signal) 20%, transparent)", color: "var(--c-signal)" }}>
                                      <Check className="h-3 w-3" /> CHOSEN
                                    </span>
                                  ) : (
                                    <span className="font-mono text-[9px]" style={{ color: "var(--c-text-mute)" }}>rejected</span>
                                  )}
                                </div>
                                <p style={{ color: "var(--c-text-dim)" }}>{opt.summary}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-5 lg:col-span-7">
                        <div>
                          <div className="mb-2 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--c-signal)" }}>
                            <Check className="h-3 w-3" /> 03 · Decision
                          </div>
                          <p
                            className="rounded-lg border-l-2 p-3 text-[13.5px] leading-relaxed"
                            style={{ borderColor: "var(--c-signal)", background: "var(--bg-panel)", color: "var(--c-text)" }}
                          >
                            {rfc.decision}
                          </p>
                        </div>
                        <div>
                          <div className="mb-2 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--c-text-mute)" }}>
                            <CornerDownRight className="h-3 w-3" style={{ color: "var(--c-primary)" }} /> 04 · Why
                          </div>
                          <ul className="space-y-2">
                            {rfc.why.map((reason, i) => (
                              <li key={i} className="flex items-start gap-2 rounded-lg border p-2.5 text-[13px] leading-relaxed" style={{ borderColor: "var(--border-soft)", background: "var(--bg-panel)", color: "var(--c-text-dim)" }}>
                                <span className="font-mono text-[11px] font-bold" style={{ color: "var(--c-primary)" }}>0{i + 1}.</span>
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
