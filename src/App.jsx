import { useState, useCallback, useEffect, useRef } from "react";
import { speak, getSpeakLabel } from "./utils/speech";
import { LiveRegion } from "./components/LiveRegion";
import { AppProvider } from "./context/AppContext";
import { Layout } from "./components/Layout";
import { Intro } from "./screens/Intro";
import { NavOnboarding } from "./screens/NavOnboarding";
import { Structure } from "./screens/Structure";
import { Collaboration } from "./screens/Collaboration";
import { BlindModeIntro } from "./screens/BlindModeIntro";
import { SprintScenario } from "./screens/SprintScenario";
import { Board } from "./screens/Board";
import { Completion } from "./screens/Completion";
import { Results } from "./screens/Results";
import { ProgramEnd } from "./screens/ProgramEnd";

const TOTAL_STEPS = 11; // 0–10

function isFocusable(el) {
  if (!el || el.getAttribute?.("aria-hidden") === "true") return false;
  const tag = el.tagName?.toLowerCase();
  if (tag === "a" && el.getAttribute("href")) return true;
  if (tag === "button" || tag === "input" || tag === "select" || tag === "textarea") return true;
  const tabIndex = el.getAttribute?.("tabindex");
  if (tabIndex !== null && tabIndex !== undefined) return true;
  if (el.getAttribute?.("contenteditable") === "true") return true;
  return false;
}

function AppContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [blindMode, setBlindMode] = useState(false);
  const [verbosity, setVerbosity] = useState("high");
  const [userVotes, setUserVotes] = useState(new Set());
  const [announcement, setAnnouncement] = useState("");
  const [keyboardHelpOpen, setKeyboardHelpOpen] = useState(false);
  const [navTabCount, setNavTabCount] = useState(0);
  const lastFocusRef = useRef(null);

  const advance = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }, []);

  const goToStep = useCallback((step) => {
    setCurrentStep(step);
  }, []);

  const announce = useCallback((message) => {
    setAnnouncement(message);
    speak(message, { interrupt: true });
  }, []);

  useEffect(() => {
    lastFocusRef.current = null;
  }, [currentStep]);

  useEffect(() => {
    const handleFocusIn = (e) => {
      const target = e.target;
      if (!target || !isFocusable(target)) return;
      if (target === lastFocusRef.current) return;
      lastFocusRef.current = target;
      const label = getSpeakLabel(target);
      if (label) speak(label, { interrupt: true });
    };
    document.addEventListener("focusin", handleFocusIn);
    return () => document.removeEventListener("focusin", handleFocusIn);
  }, []);

  const appValue = {
    currentStep,
    advance,
    goToStep,
    blindMode,
    setBlindMode,
    verbosity,
    setVerbosity,
    userVotes,
    setUserVotes,
    announce,
    navTabCount,
    setNavTabCount,
  };

  const renderScreen = () => {
    switch (currentStep) {
      case 0:
        return <Intro />;
      case 1:
        return <NavOnboarding />;
      case 2:
        return <Structure />;
      case 3:
        return <Collaboration />;
      case 4:
        return <BlindModeIntro />;
      case 5:
        return <SprintScenario />;
      case 6:
      case 7:
        return <Board />;
      case 8:
        return <Completion />;
      case 9:
        return <Results />;
      case 10:
        return <ProgramEnd />;
      default:
        return <Intro />;
    }
  };

  return (
    <AppProvider value={appValue}>
      <div
        className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 font-sans"
        data-blind-mode={blindMode ? "true" : undefined}
      >
        <LiveRegion announcement={announcement} />
        {currentStep === 0 ? (
          <main className="flex-1 flex flex-col items-center justify-center p-6">
            {renderScreen()}
          </main>
        ) : (
          <Layout
            keyboardHelpOpen={keyboardHelpOpen}
            setKeyboardHelpOpen={setKeyboardHelpOpen}
            blindMode={blindMode}
            currentStep={currentStep}
          >
            <main className="flex-1 flex flex-col items-center justify-center">
              {renderScreen()}
            </main>
          </Layout>
        )}
      </div>
    </AppProvider>
  );
}

function App() {
  return <AppContent />;
}

export default App;
