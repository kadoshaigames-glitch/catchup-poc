import { useEffect, useRef } from "react";
import { LandingScene } from "./LandingScene";

export function LandingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<LandingScene | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const landingScene = new LandingScene(canvas);
    sceneRef.current = landingScene;
    landingScene.start();

    return () => {
      landingScene.dispose();
      sceneRef.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="landing-canvas"
      aria-hidden="true"
    />
  );
}
