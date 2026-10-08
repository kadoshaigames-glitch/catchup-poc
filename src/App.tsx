import { useMemo, useState } from "react";
import { getSharedAudioController, unlockAudioSystem } from "./audio/AudioController";
import {
  getStoredCompletedModules,
  getStoredModuleProgress,
  saveCompletedModule,
  saveModuleProgress,
} from "./components/CourseTrainingTimer";
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
  const [completedModuleIds, setCompletedModuleIds] = useState<string[]>(() => {
    return getStoredCompletedModules();
  });
  const [moduleProgress, setModuleProgress] = useState<Record<string, number>>(() => {
    return getStoredModuleProgress();
  });

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
    if (code.trim() === ACCESS_CODE) {
      setAccessError(null);
      setView("module-select");
    } else {
      setAccessError("Invalid access code. Please check the code and try again.");
    }
  };

  const handleSelectModule = (moduleId: string) => {
    const recap = getLessonRecap(moduleId) ?? getLessonRecap("module-1");
    unlockAudioSystem(recap?.beats[0]?.audioSrc);
    setSelectedModuleId(moduleId);
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
          <WelcomeScreen
            onStart={() => {
              setAccessError(null);
              setView("access");
            }}
          />
        ) : (
          <AccessCodeScreen
            error={accessError}
            onSubmit={handleCodeSubmit}
            onBack={() => {
              setAccessError(null);
              setView("welcome");
            }}
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
        moduleProgress={moduleProgress}
        onSelectModule={handleSelectModule}
        onBack={() => setView("access")}
      />
    );
  }

  const handleExitLesson = () => {
    getSharedAudioController().cancel();
    setView("module-select");
  };

  const handleProgressUpdate = (moduleId: string, seconds: number) => {
    saveModuleProgress(moduleId, seconds);
    setModuleProgress((prev) => ({
      ...prev,
      [moduleId]: Math.max(prev[moduleId] ?? 0, Math.round(seconds)),
    }));
  };

  const handleCompleteModule = (moduleId: string) => {
    saveCompletedModule(moduleId);
    setCompletedModuleIds((prev) => (prev.includes(moduleId) ? prev : [...prev, moduleId]));
  };

  // Screen 4: Lesson Player
  if (view === "lesson-player" && currentRecap) {
    return (
      <LessonPlayer
        key={currentRecap.id}
        lesson={currentRecap}
        onExit={handleExitLesson}
        onCompleteModule={handleCompleteModule}
        onProgressUpdate={handleProgressUpdate}
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
