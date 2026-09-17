import { useCallback, useEffect, useState } from "react";

export type OsMode = "neural" | "orbital" | "os";

const MODE_KEY = "nc-os-mode";

/** Global interface mode: NEURAL / ORBITAL / OS. Persisted + reflected on <html>. */
export function useMode() {
  const [mode, setModeState] = useState<OsMode>(() => {
    if (typeof document === "undefined") return "neural";
    try {
      const saved = localStorage.getItem(MODE_KEY) as OsMode | null;
      if (saved === "neural" || saved === "orbital" || saved === "os") return saved;
    } catch {
      /* ignore */
    }
    return "neural";
  });

  const setMode = useCallback((next: OsMode) => {
    const root = document.documentElement;
    root.classList.remove("mode-neural", "mode-orbital", "mode-os");
    root.classList.add(`mode-${next}`);
    try {
      localStorage.setItem(MODE_KEY, next);
    } catch {
      /* ignore */
    }
    setModeState(next);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("mode-neural", "mode-orbital", "mode-os");
    root.classList.add(`mode-${mode}`);
  }, [mode]);

  return { mode, setMode };
}

/** Reveal-on-scroll for `.reveal` and `.window-reveal` nodes via one observer. */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>(".reveal:not(.in), .window-reveal:not(.in)");
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      nodes.forEach((n) => n.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Active section id for the command-bar navigation highlight. */
export function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-24% 0px -66% 0px", threshold: [0.05, 0.3] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids]);
  return active;
}

/** Live UTC-ish mission clock ticking every second. */
export function useMissionClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}
