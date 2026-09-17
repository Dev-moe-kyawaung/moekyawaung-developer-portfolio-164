import { useState } from "react";
import { ArrowUpRight, Cpu, Activity, ChevronDown, Minus, Square, Circle, Waypoints } from "lucide-react";
import { GithubIcon, PlayStoreIcon } from "./icons";
import { soundFx } from "../lib/soundFx";
import type { OsMode } from "../lib/hooks";
import type { ProjectItem } from "../types/portfolio";

interface ClustersSectionProps {
  projects: ProjectItem[];
  mode: OsMode;
}

const MODE_HEADING: Record<OsMode, { kicker: string; title: string; sub: string }> = {
  neural: {
    kicker: "Section 01 · Neural Clusters",
    title: "Projects as living neural clusters",
    sub: "Each system is a cluster of synapses — expand a node to trace its signal path from problem to shipped outcome.",
  },
  orbital: {
    kicker: "Section 01 · Mission Logs",
    title: "Projects as flight mission logs",
    sub: "Each system is a logged mission — telemetry, objective, and recovered outcome, streamed from the command console.",
  },
  os: {
    kicker: "Section 01 · Application Windows",
    title: "Projects as holographic OS windows",
    sub: "Each system is an application window — open one to inspect its architecture, telemetry, and deploy links.",
  },
};

function WindowChrome({ mode, label }: { mode: OsMode; label: string }) {
  return (
    <div className="flex items-center justify-between border-b px-4 py-2.5" style={{ borderColor: "var(--border-soft)" }}>
      <div className="flex items-center gap-2">
        {mode === "os" ? (
          <>
            <Circle className="h-2.5 w-2.5" style={{ color: "var(--c-tertiary)", fill: "var(--c-tertiary)" }} />
            <Circle className="h-2.5 w-2.5" style={{ color: "var(--c-secondary)", fill: "var(--c-secondary)" }} />
            <Circle className="h-2.5 w-2.5" style={{ color: "var(--c-signal)", fill: "var(--c-signal)" }} />
          </>
        ) : (
          <span className="live-blink h-2 w-2 rounded-full" style={{ background: "var(--c-signal)" }} />
        )}
        <span className="ml-1 font-mono text-[10px] tracking-wide" style={{ color: "var(--c-text-mute)" }}>
          {label}
        </span>
      </div>
      {mode === "os" ? (
        <div className="flex items-center gap-2" style={{ color: "var(--c-text-mute)" }}>
          <Minus className="h-3 w-3" />
          <Square className="h-2.5 w-2.5" />
        </div>
      ) : (
        <Waypoints className="h-3.5 w-3.5" style={{ color: "var(--c-primary)" }} />
      )}
    </div>
  );
}

function ClusterCard({ project, index, mode }: { project: ProjectItem; index: number; mode: OsMode }) {
  const [open, setOpen] = useState(false);
  const wide = project.span === "wide";

  const chromeLabel =
    mode === "neural"
      ? `cluster://${project.id}`
      : mode === "orbital"
      ? `MISSION-LOG-0${index + 1}`
      : `${project.id}.app`;

  return (
    <article
      className={`window-reveal glass holo-frame scanline-panel group flex flex-col overflow-hidden rounded-2xl ${
        wide ? "lg:col-span-7" : "lg:col-span-5"
      }`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <WindowChrome mode={mode} label={chromeLabel} />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="synapse-node grid h-12 w-12 shrink-0 place-items-center rounded-xl border font-display text-lg font-bold"
              style={{
                borderColor: "var(--border-mid)",
                background: "color-mix(in srgb, var(--c-primary) 12%, transparent)",
                color: "var(--c-primary)",
              }}
            >
              {project.monogram}
            </div>
            <div>
              <span className="label-mono text-[9px]">{project.category}</span>
              <h3 className="font-display text-lg font-bold leading-tight" style={{ color: "var(--c-text)" }}>
                {project.name}
              </h3>
            </div>
          </div>
          <span className="rounded-md border px-2 py-1 font-mono text-[10px]" style={{ borderColor: "var(--border-soft)", color: "var(--c-primary)" }}>
            0{index + 1}
          </span>
        </div>

        {/* problem */}
        <p className="mt-4 text-[13.5px] leading-relaxed" style={{ color: "var(--c-text-dim)" }}>
          <span className="font-mono text-[11px]" style={{ color: "var(--c-tertiary)" }}>
            {mode === "orbital" ? "ANOMALY // " : mode === "neural" ? "STIMULUS // " : "ISSUE // "}
          </span>
          {project.problem}
        </p>

        {/* outcome bar */}
        <div
          className="mt-4 flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-[11.5px]"
          style={{ borderColor: "var(--border-mid)", background: "color-mix(in srgb, var(--c-signal) 8%, transparent)", color: "var(--c-text)" }}
        >
          <Activity className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--c-signal)" }} />
          <span style={{ color: "var(--c-signal)" }} className="font-semibold">IMPACT:</span>
          <span className="truncate">{project.outcome}</span>
        </div>

        {/* metric gauges */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {project.metrics.map((m) => (
            <div key={m.label} className="rounded-lg border p-2.5 text-center" style={{ borderColor: "var(--border-soft)", background: "var(--bg-panel)" }}>
              <div className="font-display text-base font-bold" style={{ color: "var(--c-text)" }}>{m.value}</div>
              <div className="mt-0.5 font-mono text-[9px] uppercase" style={{ color: "var(--c-text-mute)" }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* stack */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <span key={s} className="rounded border px-2 py-0.5 font-mono text-[10.5px]" style={{ borderColor: "var(--border-soft)", color: "var(--c-text-dim)" }}>
              {s}
            </span>
          ))}
        </div>

        {/* expandable architecture trace */}
        <button
          onClick={() => { setOpen((v) => !v); soundFx.playCircuitProbe(); }}
          aria-expanded={open}
          className="mt-4 flex items-center gap-2 font-mono text-[11px] transition-colors"
          style={{ color: "var(--c-primary)" }}
        >
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
          {mode === "neural" ? "TRACE SIGNAL PATH" : mode === "orbital" ? "DECRYPT MISSION DATA" : "INSPECT SOURCE TREE"}
        </button>

        {open && (
          <div
            className="mt-3 rounded-lg border p-3 font-mono text-[12px] leading-relaxed"
            style={{ borderColor: "var(--border-soft)", background: "var(--bg-panel)", color: "var(--c-text-dim)" }}
          >
            <span style={{ color: "var(--c-primary)" }}>ARCH // </span>
            {project.architectureHighlight}
          </div>
        )}

        {/* deep links */}
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t pt-4" style={{ borderColor: "var(--border-soft)" }}>
          <a
            href={project.playStoreUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => soundFx.playPlasmaBurst()}
            className="btn-primary flex-1 justify-center !py-2.5 !text-[12px]"
          >
            <PlayStoreIcon className="h-4 w-4" />
            Play Store
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => soundFx.playSynthwaveLaser()}
            className="btn-ghost flex-1 justify-center !py-2.5 !text-[12px]"
          >
            <GithubIcon className="h-4 w-4" />
            Source
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}

export function ClustersSection({ projects, mode }: ClustersSectionProps) {
  const h = MODE_HEADING[mode];
  return (
    <section id="clusters" className="relative z-10 border-t px-4 py-24 sm:px-6" style={{ borderColor: "var(--border-soft)" }}>
      <div className="mx-auto max-w-[1320px]">
        <header className="reveal mb-12 max-w-2xl">
          <div className="mb-2 flex items-center gap-2 font-mono text-[11px]" style={{ color: "var(--c-primary)" }}>
            <Cpu className="h-4 w-4" /> {h.kicker}
          </div>
          <h2 className="headline text-3xl sm:text-4xl md:text-5xl">
            <span className="gradient-text">{h.title}</span>
          </h2>
          <p className="mt-3 text-[15px]" style={{ color: "var(--c-text-dim)" }}>{h.sub}</p>
        </header>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {projects.map((p, i) => (
            <ClusterCard key={p.id} project={p} index={i} mode={mode} />
          ))}
        </div>
      </div>
    </section>
  );
}
