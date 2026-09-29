import { useMemo, useState } from "react";
import { unlockAudioSystem } from "./audio/AudioController";
import { ACCESS_CODE, catalog, getModule } from "./content/catalog";
import { getLessonRecap } from "./content/registry";
import { LessonPlayer } from "./lesson/LessonPlayer";
import { LandingBackground } from "./scene/landing/LandingBackground";
import { AccessCodeScreen } from "./screens/AccessCodeScreen";
import { ModuleSelectScreen } from "./screens/ModuleSelectScreen";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import type { AppView } from "./types/lesson";

export function App() {
  const [view, setView] = useState<AppView>("welcome");
  const [accessError, setAccessError] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string>("module-1");
  const [completedModuleIds, setCompletedModuleIds] = useState<string[]>([]);

  const currentModule = useMemo(() => {
    return getModule(selectedModuleId) ?? catalog[0];
  }, [selectedModuleId]);

  const currentRecap = useMemo(() => {
    return (
      getLessonRecap(selectedModuleId) ??
      (currentModule?.recapId ? getLessonRecap(currentModule.recapId) : undefined)
    );
  }, [selectedModuleId, currentModule]);

  const handleCodeSubmit = (code: string) => {
    if (code.trim().toUpperCase() === ACCESS_CODE.toUpperCase()) {
      setAccessError(null);
      setView("module-select");
    } else {
      setAccessError(`Invalid access code. Please use the prototype code: ${ACCESS_CODE}`);
    }
  };

  const handleDemoAccess = () => {
    setAccessError(null);
    setView("module-select");
  };

  const handleSelectModule = (moduleId: string) => {
    unlockAudioSystem();
    setSelectedModuleId(moduleId);
    const recap = getLessonRecap(moduleId) ?? getLessonRecap("module-1");
    if (recap) {
      setView("lesson-player");
    }
  };

  // Screen 1: Welcome & Screen 2: Access Code (both share the immersive 3D landing environment)
  if (view === "welcome" || view === "access") {
    return (
      <div className="landing-layout">
        <LandingBackground />
        {view === "welcome" ? (
          <WelcomeScreen onStart={() => setView("access")} />
        ) : (
          <AccessCodeScreen
            error={accessError}
            onSubmit={handleCodeSubmit}
            onDemoAccess={handleDemoAccess}
            onBack={() => setView("welcome")}
          />
        )}
      </div>
    );
  }

  // Screen 3: Module Selection
  if (view === "module-select") {
    return (
      <ModuleSelectScreen
        modules={catalog}
        completedModuleIds={completedModuleIds}
        onSelectModule={handleSelectModule}
        onBack={() => setView("access")}
      />
    );
  }

  const handleExitLesson = () => {
    setView("module-select");
  };

  const handleCompleteModule = (moduleId: string) => {
    setCompletedModuleIds((prev) => (prev.includes(moduleId) ? prev : [...prev, moduleId]));
  };

  // Screen 4: Lesson Player
  if (view === "lesson-player" && currentRecap) {
    return (
      <LessonPlayer
        lesson={currentRecap}
        onExit={handleExitLesson}
        onCompleteModule={handleCompleteModule}
      />
    );
  }

  return (
    <div className="landing-layout">
      <LandingBackground />
      <AccessCodeScreen
        error="Module recap could not be loaded. Please re-enter access code."
        onSubmit={handleCodeSubmit}
        onBack={() => setView("welcome")}
      />
    </div>
  );
}
