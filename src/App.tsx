import { useState } from "react";
import metricsData from "./data/metrics.json";
import projectsData from "./data/projects.json";
import tradeoffsData from "./data/tradeoffs.json";
import experienceData from "./data/experience.json";

import { CommandCanvas } from "./components/CommandCanvas";
import { CommandBar } from "./components/CommandBar";
import { CommandDeck } from "./components/CommandDeck";
import { ClustersSection } from "./components/ClustersSection";
import { DecisionsSection } from "./components/DecisionsSection";
import { TimelineSection } from "./components/TimelineSection";
import { ContactSection } from "./components/ContactSection";
import { Assistant } from "./components/Assistant";

import { useMode, useReveal } from "./lib/hooks";
import { downloadResumeSheet } from "./lib/resumeDownload";
import type {
  MetricsConfig,
  ProjectItem,
  TradeoffItem,
  ExperienceItem,
} from "./types/portfolio";

const config = metricsData as MetricsConfig;
const projects = projectsData as ProjectItem[];
const tradeoffs = tradeoffsData as TradeoffItem[];
const experience = experienceData as ExperienceItem[];

export default function App() {
  const { mode, setMode } = useMode();
  const [assistantOpen, setAssistantOpen] = useState(false);

  // Re-run reveal observer whenever the mode changes (cards remount).
  useReveal([mode]);

  const handleDownloadResume = () => {
    downloadResumeSheet(config.profile, projects, experience);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: "var(--bg-void)" }}>
      <a
        href="#clusters"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:px-4 focus:py-2 focus:font-mono focus:font-bold"
        style={{ background: "var(--c-primary)", color: "var(--bg-void)" }}
      >
        Skip to systems
      </a>

      {/* generative background */}
      <CommandCanvas mode={mode} />

      {/* command bar */}
      <CommandBar
        profile={config.profile}
        mode={mode}
        onModeChange={setMode}
        onDownloadResume={handleDownloadResume}
      />

      <main className="relative z-10">
        <CommandDeck
          profile={config.profile}
          ticker={config.ticker}
          mode={mode}
          onOpenAssistant={() => setAssistantOpen(true)}
        />
        <ClustersSection projects={projects} mode={mode} />
        <DecisionsSection tradeoffs={tradeoffs} mode={mode} />
        <TimelineSection experience={experience} mode={mode} />
        <ContactSection profile={config.profile} mode={mode} onDownloadResume={handleDownloadResume} />
      </main>

      <Assistant mode={mode} open={assistantOpen} onOpenChange={setAssistantOpen} />
    </div>
  );
}
