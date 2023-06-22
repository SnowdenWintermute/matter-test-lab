"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import { TestGame } from "./TestGame";
import useWindowDimensions from "./Hooks/useWindowDimensions";
import { addCanvasInputListeners, removeCanvasInputListeners } from "./TestGame/canvasInputListeners";

export type WidthAndHeight = { width: number; height: number };

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasSizeRef = useRef<WidthAndHeight | null>(null);
  const gameRef = useRef<TestGame>(new TestGame());
  const windowDimensions = useWindowDimensions();

  const [canvasSize, setCanvasSize] = useState<WidthAndHeight>({
    width: 1920,
    height: 1080,
  });

  useEffect(() => {
    if (!windowDimensions) return;
    // even though we don't use this value for anything, the fact that we set state forces a react refresh which actually makes the
    // canvas resize, so its needed for now
    setCanvasSize({
      height: windowDimensions.height,
      width: windowDimensions.width,
    });
    canvasSizeRef.current = {
      height: windowDimensions.height,
      width: windowDimensions.width,
    };
  }, [setCanvasSize, windowDimensions]);

  useEffect(() => {
    const gameRefCurrent = gameRef.current;
    gameRef.current.canvasSize = { width: canvasSize.width, height: canvasSize.height };
    gameRef.current.intervals.physics = setTimeout(() => {
      const context = canvasRef.current?.getContext("2d");
      if (!context || !canvasSizeRef.current) return;
      gameRef.current.stepGame(context, canvasSizeRef.current);
    });

    return () => {
      gameRefCurrent.clearPhysicsInterval();
    };
  }, [canvasRef, canvasSize.height, canvasSize.width]);

  useEffect(() => {
    const canvasRefCurrent = canvasRef.current;
    const gameRefCurrent = gameRef.current;
    if (canvasRef.current) addCanvasInputListeners(document, canvasRef.current, gameRef.current);
    return () => {
      if (canvasRefCurrent) removeCanvasInputListeners(document, canvasRefCurrent, gameRefCurrent);
    };
  }, [canvasRef]);

  return (
    <main className={styles.main}>
      <canvas
        height={canvasSizeRef.current?.height}
        width={canvasSizeRef.current?.width}
        id="canvas"
        className={styles.canvas}
        ref={canvasRef}
        onContextMenu={(e) => e.preventDefault()}
      />
    </main>
  );
}
