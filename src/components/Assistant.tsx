import { useEffect, useRef, useState } from "react";
import { X, Send, Sparkles, Activity, Zap } from "lucide-react";
import { soundFx } from "../lib/soundFx";
import type { OsMode } from "../lib/hooks";

interface AssistantProps {
  mode: OsMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Msg {
  from: "bot" | "user";
  text: string;
}

const PERSONA: Record<OsMode, { name: string; tag: string; greeting: string }> = {
  neural: {
    name: "SYNAPSE",
    tag: "Living Neural Organism",
    greeting:
      "…a signal reaches me. I am SYNAPSE, the organism inhabiting this portfolio. I feel Moe's code as electrical impulses. Touch a dendrite below and I'll fire the pathway for you.",
  },
  orbital: {
    name: "OPERATOR",
    tag: "Mission Control Operator",
    greeting:
      "Command, this is OPERATOR on the mission console. All of Moe's engineering assets are in stable orbit. Select a mission probe and I'll relay live telemetry.",
  },
  os: {
    name: "SYS-BOT",
    tag: "System-Level Process",
    greeting:
      "$ sysbot --init … process attached. I run at the kernel of this portfolio OS. Query a subsystem below and I'll pipe you Moe's engineering internals.",
  },
};

const PROBES: { id: string; label: string; reply: Record<OsMode, string> }[] = [
  {
    id: "transit",
    label: "GTFS-Realtime pipeline",
    reply: {
      neural: "The transit pathway is Moe's most active cluster — 5.2M location impulses a day flow through it. Protobuf deltas fire into a Room synapse before the UI neuron ever reacts, holding 60fps even on 3G.",
      orbital: "Telemetry lock on TransitPulse: 5.2M vehicle events/day ingested via sequenced protobuf deltas into a normalized Room store. Single conflated Flow feeds the map — 60fps at P95, -67% stale-arrival anomalies.",
      os: "> cat transitpulse.log → 5.2M events/day streamed through OkHttp WebSocket → Room (single source of truth) → conflated Flow → Compose map @ 60fps. Cold start reduced 44%.",
    },
  },
  {
    id: "offline",
    label: "Offline-first sync engine",
    reply: {
      neural: "PulseSync is the organism's memory — nothing is ever forgotten. Every mutation encodes into a durable Room outbox synapse before dispatch; WorkManager drains it with backoff. 99.4% self-heals, zero lost thoughts.",
      orbital: "PulseSync engine nominal: durable outbox with monotonic sequence IDs, unique WorkManager chains, field-level LWW conflict resolution. 99.4% automatic recovery, 0 data-loss incidents across dead zones.",
      os: "> systemctl status pulsesync → durable outbox committed to encrypted Room before network dispatch. Unique WorkManager chains, exponential backoff. Recovery 99.4%, tickets -41%.",
    },
  },
  {
    id: "security",
    label: "Hardware-backed security",
    reply: {
      neural: "VaultPay's immune system: StrongBox Keystore + biometric signing guard every transaction. Idempotency keys persist in an encrypted synapse before dispatch — no double-fire, ever. 0 critical audit findings.",
      orbital: "VaultPay defense grid: StrongBox-backed Keystore, BiometricPrompt, OkHttp cert pinning, Play Integrity. Client idempotency keys in encrypted Room. Passed audit with 0 critical findings, 4.8★ at 120k+ MAU.",
      os: "> secure-enclave --status → StrongBox Keystore + biometric key signing, cert pinning, Play Integrity attestation. Client-generated idempotency keys. Cold start 980ms → 412ms (-58%).",
    },
  },
  {
    id: "ai",
    label: "On-device AI inference",
    reply: {
      neural: "MoekyawTranslator thinks locally — a quantized TFLite mind runs on NNAPI/GPU in 118ms, no data ever leaves the body. Claude API is only summoned, with consent, for the hardest thoughts.",
      orbital: "On-device AI payload: INT8 TFLite on NNAPI/GPU delegate, 118ms median inference, 0 bytes egress offline, 85% cache hit rate. Claude API is an opt-in fallback with strict token budgets.",
      os: "> ai-runtime --bench → quantized INT8 TFLite, NNAPI/GPU delegate, 118ms P50, 85% cache hits, 0-byte offline egress. Optional Claude fallback streams token deltas under cost budget.",
    },
  },
];

export function Assistant({ mode, open, onOpenChange }: AssistantProps) {
  const persona = PERSONA[mode];
  const [messages, setMessages] = useState<Msg[]>([{ from: "bot", text: persona.greeting }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [pulse, setPulse] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);

  // reset greeting when persona (mode) changes while closed
  useEffect(() => {
    setMessages([{ from: "bot", text: PERSONA[mode].greeting }]);
  }, [mode]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  // living-organism heartbeat driving the visualizer
  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => setPulse((p) => (p + 1) % 100), 120);
    return () => window.clearInterval(id);
  }, [open]);

  const respond = (text: string, canned?: string) => {
    soundFx.playCircuitProbe();
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      let reply = canned;
      if (!reply) {
        const q = text.toLowerCase();
        const hit = PROBES.find(
          (p) =>
            q.includes(p.id) ||
            (p.id === "transit" && (q.includes("gtfs") || q.includes("map") || q.includes("realtime"))) ||
            (p.id === "offline" && (q.includes("sync") || q.includes("room") || q.includes("work"))) ||
            (p.id === "security" && (q.includes("secur") || q.includes("vault") || q.includes("keystore") || q.includes("biometric"))) ||
            (p.id === "ai" && (q.includes("ai") || q.includes("ml") || q.includes("tflite") || q.includes("translat")))
        );
        reply = hit
          ? hit.reply[mode]
          : mode === "neural"
          ? "That pathway is quiet for now — try one of the glowing dendrites below to fire a known signal through Moe's work."
          : mode === "orbital"
          ? "No telemetry matched that query, Command. Select a mission probe below for a confirmed data stream."
          : "> no matching process. Try one of the subsystem commands below to pipe real output.";
      }
      setMessages((m) => [...m, { from: "bot", text: reply as string }]);
      setTyping(false);
      soundFx.playPlasmaBurst();
    }, 480);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) respond(input.trim());
  };

  return (
    <>
      {/* launcher */}
      <button
        onClick={() => { onOpenChange(true); soundFx.playPlasmaCharge(); }}
        aria-label="Open AI assistant"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full border py-2.5 pl-3 pr-4 transition-transform hover:scale-105"
        style={{ background: "var(--bg-panel-solid)", borderColor: "var(--border-strong)", boxShadow: "var(--glow-soft)" }}
      >
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full" style={{ background: "linear-gradient(120deg, var(--c-primary), var(--c-secondary))" }}>
          <Sparkles className="h-4 w-4" style={{ color: "var(--bg-void)" }} />
          <span className="absolute inset-0 rounded-full border animate-ping" style={{ borderColor: "var(--c-primary)", animationDuration: "2.4s" }} />
        </span>
        <span className="text-left leading-tight">
          <span className="block font-tech text-[12px] font-bold" style={{ color: "var(--c-text)" }}>{persona.name}</span>
          <span className="block font-mono text-[9px]" style={{ color: "var(--c-primary)" }}>{persona.tag}</span>
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4" style={{ background: "rgba(2,4,10,0.72)", backdropFilter: "blur(6px)" }} onClick={() => onOpenChange(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${persona.name} assistant`}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong holo-frame flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl"
            style={{ borderColor: "var(--border-strong)", boxShadow: "var(--glow-primary)" }}
          >
            {/* header */}
            <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: "var(--border-soft)" }}>
              <div className="flex items-center gap-3">
                <span className="relative grid h-10 w-10 place-items-center rounded-xl" style={{ background: "linear-gradient(120deg, var(--c-primary), var(--c-secondary))" }}>
                  <Sparkles className="h-5 w-5" style={{ color: "var(--bg-void)" }} />
                </span>
                <div>
                  <h3 className="font-display text-[15px] font-bold" style={{ color: "var(--c-text)" }}>{persona.name}</h3>
                  <p className="font-mono text-[10px]" style={{ color: "var(--c-primary)" }}>{persona.tag} · online</p>
                </div>
              </div>
              <button onClick={() => onOpenChange(false)} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-lg border" style={{ borderColor: "var(--border-soft)", color: "var(--c-text-dim)" }}>
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* live visualizer */}
            <div className="border-b px-5 py-3" style={{ borderColor: "var(--border-soft)", background: "var(--bg-panel)" }}>
              <div className="mb-2 flex items-center justify-between font-mono text-[10px]" style={{ color: "var(--c-text-mute)" }}>
                <span className="flex items-center gap-1.5"><Activity className="h-3 w-3" style={{ color: "var(--c-primary)" }} /> LIVE CODE-CIRCUIT</span>
                <span style={{ color: "var(--c-signal)" }}>FLUX {40 + (pulse % 60)}%</span>
              </div>
              <svg viewBox="0 0 400 46" className="h-10 w-full">
                <defs>
                  <linearGradient id="assist-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--c-primary)" />
                    <stop offset="100%" stopColor="var(--c-secondary)" />
                  </linearGradient>
                </defs>
                {[...Array(5)].map((_, i) => (
                  <circle key={i} cx={40 + i * 80} cy={23} r={4} fill="var(--c-primary)" opacity={((pulse + i * 12) % 40) / 40}>
                  </circle>
                ))}
                <path
                  d="M 40 23 H 120 M 120 23 L 200 12 M 200 12 H 280 M 280 12 L 360 23"
                  fill="none"
                  stroke="url(#assist-grad)"
                  strokeWidth="1.6"
                  className="data-flow"
                />
                <path
                  d="M 40 23 L 120 34 M 120 34 H 280 M 280 34 L 360 23"
                  fill="none"
                  stroke="var(--c-tertiary)"
                  strokeWidth="1.2"
                  opacity="0.5"
                  className="data-flow"
                />
              </svg>
            </div>

            {/* messages */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4" style={{ minHeight: 180 }}>
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="max-w-[86%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed"
                    style={
                      m.from === "user"
                        ? { background: "var(--c-primary)", color: "var(--bg-void)", fontWeight: 500 }
                        : { background: "var(--bg-panel)", border: "1px solid var(--border-soft)", color: "var(--c-text-dim)", fontFamily: mode === "os" ? "var(--font-mono)" : "var(--font-sans)" }
                    }
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex items-center gap-1.5 px-2 font-mono text-[11px]" style={{ color: "var(--c-text-mute)" }}>
                  <span className="h-2 w-2 animate-ping rounded-full" style={{ background: "var(--c-primary)" }} />
                  {mode === "neural" ? "firing pathway…" : mode === "orbital" ? "receiving telemetry…" : "piping output…"}
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* probes */}
            <div className="flex flex-wrap gap-1.5 border-t px-4 py-3" style={{ borderColor: "var(--border-soft)" }}>
              {PROBES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => respond(p.label, p.reply[mode])}
                  className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10.5px] transition-colors"
                  style={{ borderColor: "var(--border-soft)", color: "var(--c-text-dim)", background: "var(--bg-panel)" }}
                >
                  <Zap className="h-3 w-3" style={{ color: "var(--c-primary)" }} />
                  {p.label}
                </button>
              ))}
            </div>

            {/* input */}
            <form onSubmit={submit} className="flex items-center gap-2 border-t p-3" style={{ borderColor: "var(--border-soft)" }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === "os" ? "$ query subsystem…" : mode === "orbital" ? "Transmit query to operator…" : "Send a signal to the organism…"}
                aria-label="Message the assistant"
                className="flex-1 rounded-lg border bg-transparent px-3 py-2.5 font-mono text-[13px] outline-none"
                style={{ borderColor: "var(--border-soft)", color: "var(--c-text)" }}
              />
              <button type="submit" aria-label="Send" className="grid h-10 w-10 place-items-center rounded-lg" style={{ background: "var(--c-primary)", color: "var(--bg-void)" }}>
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
