import { useEffect, useRef } from "react";
import type { BoardContent, CameraShotId } from "../types/lesson";
import { ClassroomScene } from "./ClassroomScene";

type Props = {
  camera: CameraShotId;
  board: BoardContent;
  localSec: number;
  beatId?: string;
  moduleId?: string;
  playbackSec?: number;
  beatStartSec?: number;
  isPlaying?: boolean;
  questionOpen?: boolean;
};

export function SceneCanvas({
  camera,
  board,
  localSec,
  beatId,
  moduleId,
  playbackSec,
  beatStartSec,
  isPlaying,
  questionOpen,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<ClassroomScene | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const classroom = new ClassroomScene(canvas, undefined, moduleId);
    sceneRef.current = classroom;
    if (typeof window !== "undefined") {
      (window as unknown as { __classroomScene?: ClassroomScene; __awangController?: unknown }).__classroomScene = classroom;
      (window as unknown as { __classroomScene?: ClassroomScene; __awangController?: unknown }).__awangController = classroom.instructor;
    }
    classroom.start();
    return () => {
      if (typeof window !== "undefined") {
        delete (window as unknown as { __classroomScene?: ClassroomScene }).__classroomScene;
        delete (window as unknown as { __awangController?: unknown }).__awangController;
      }
      classroom.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.apply({
      camera,
      board,
      localSec,
      beatId,
      moduleId,
      playbackSec,
      beatStartSec,
      isPlaying,
      questionOpen,
    });
  }, [
    camera,
    board,
    localSec,
    beatId,
    moduleId,
    playbackSec,
    beatStartSec,
    isPlaying,
    questionOpen,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="scene-canvas"
      aria-label="3D classroom for the lesson recap experience"
    />
  );
}
