import { useEffect, useRef, useState } from "react";
import { AudioController } from "../audio/AudioController";
import { SceneCanvas } from "../scene/SceneCanvas";
import type { LessonRecap } from "../types/lesson";
import { KnowledgeCheck } from "./KnowledgeCheck";
import { LessonHud } from "./LessonHud";
import { ModuleAssessment } from "./ModuleAssessment";
import { useLessonPlayback } from "./useLessonPlayback";

type Props = {
  lesson: LessonRecap;
  onExit: () => void;
  onCompleteModule?: (moduleId: string) => void;
};

export function LessonPlayer({ lesson, onExit, onCompleteModule }: Props) {
  const playback = useLessonPlayback(lesson);
  const audioRef = useRef<AudioController | null>(null);
  if (!audioRef.current) {
    audioRef.current = new AudioController();
  }
  if (typeof window !== "undefined") {
    (window as any).__catchupAudio = audioRef.current;
  }
  const lastBeatIdRef = useRef<string>("");

  const isTeachingComplete = playback.time >= lesson.durationSec - 0.05;
  const [assessmentDismissed, setAssessmentDismissed] = useState(false);

  // If learner seeks backward into the lesson, re-arm assessment for next completion
  useEffect(() => {
    if (playback.time < lesson.durationSec - 1) {
      setAssessmentDismissed(false);
    }
  }, [playback.time, lesson.durationSec]);

  const showAssessment = isTeachingComplete && !assessmentDismissed;

  const handleAssessmentComplete = () => {
    if (onCompleteModule) {
      onCompleteModule(lesson.moduleId);
    }
    onExit();
  };

  const handleReviewLesson = () => {
    setAssessmentDismissed(true);
    handleSeek(0);
    playback.play();
  };

  const camera = playback.cameraOverride ?? playback.activeBeat.camera;
  const localSec =
    playback.activeBeat.board.kind === "layers"
      ? playback.time - playback.activeBeat.startSec
      : 0;

  useEffect(() => {
    const audio = audioRef.current!;
    if (!playback.playing) {
      audio.pause();
      return;
    }

    if (playback.questionOpen && playback.knowledgeCheck && !playback.submitted) {
      audio.speak(playback.knowledgeCheck.question);
      return;
    }

    if (playback.activeBeat.id !== lastBeatIdRef.current) {
      lastBeatIdRef.current = playback.activeBeat.id;
      if (playback.activeBeat.audioSrc) {
        const localOffset = Math.max(0, playback.time - playback.activeBeat.startSec);
        audio.playClip(playback.activeBeat.audioSrc, localOffset);
      } else {
        audio.speak(playback.activeBeat.narration);
      }
    } else {
      audio.resume();
    }
  }, [
    playback.playing,
    playback.activeBeat.id,
    playback.activeBeat.narration,
    playback.activeBeat.audioSrc,
    playback.activeBeat.startSec,
    playback.questionOpen,
    playback.knowledgeCheck,
    playback.submitted,
  ]);

  const handleSeek = (nextTime: number) => {
    playback.seek(nextTime);
    const applicable = lesson.beats.filter((beat) => beat.startSec <= nextTime);
    const targetBeat = applicable[applicable.length - 1] ?? lesson.beats[0];
    lastBeatIdRef.current = targetBeat.id;
    const localOffset = Math.max(0, nextTime - targetBeat.startSec);

    if (targetBeat.audioSrc) {
      audioRef.current!.seekClip(targetBeat.audioSrc, localOffset, playback.playing);
    } else {
      if (playback.playing) {
        audioRef.current!.speak(targetBeat.narration);
      } else {
        audioRef.current!.stopClip();
      }
    }
  };

  const handleGoToBeat = (beatId: string) => {
    const beat = lesson.beats.find((b) => b.id === beatId);
    if (beat) {
      handleSeek(beat.startSec + 0.01);
    }
  };

  useEffect(() => {
    return () => audioRef.current?.cancel();
  }, []);

  return (
    <div className="player">
      <SceneCanvas
        camera={camera}
        board={playback.activeBeat.board}
        localSec={localSec}
        beatId={playback.activeBeat.id}
        moduleId={lesson.moduleId}
        playbackSec={playback.time}
        beatStartSec={playback.activeBeat.startSec}
        isPlaying={playback.playing}
        questionOpen={playback.questionOpen || showAssessment}
      />
      {!showAssessment && (
        <div className="caption">
          <p>{playback.activeBeat.narration}</p>
        </div>
      )}
      <LessonHud
        lessonTitle={lesson.title}
        prototypeNote={lesson.prototypeNote}
        durationSec={lesson.durationSec}
        time={playback.time}
        playing={playback.playing}
        beats={lesson.beats}
        activeBeatId={playback.activeBeat.id}
        camera={camera}
        questionOpen={playback.questionOpen || showAssessment}
        onPlay={playback.play}
        onPause={playback.pause}
        onSeek={handleSeek}
        onGoToBeat={handleGoToBeat}
        onCamera={playback.setCameraOverride}
        onExit={onExit}
      />
      {playback.questionOpen && playback.knowledgeCheck ? (
        <div className="check-overlay">
          <KnowledgeCheck
            question={playback.knowledgeCheck.question}
            options={playback.knowledgeCheck.options}
            correctId={playback.knowledgeCheck.correctId}
            confirmText={playback.knowledgeCheck.confirmText}
            selectedOptionId={playback.selectedOptionId}
            submitted={playback.submitted}
            onSelect={playback.setSelectedOptionId}
            onSubmit={playback.submitAnswer}
            onContinue={playback.dismissCheck}
          />
        </div>
      ) : null}
      {showAssessment && (
        <ModuleAssessment
          moduleId={lesson.moduleId}
          onComplete={handleAssessmentComplete}
          onReviewLesson={handleReviewLesson}
        />
      )}
    </div>
  );
}
