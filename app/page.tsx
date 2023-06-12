"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import { TestGame } from "./TestGame";
import { MobileEntity } from "./TestGame/MobileEntity";
import Matter from "matter-js";
import useWindowDimensions from "./Hooks/useWindowDimensions";
import {
  addCanvasInputListeners,
  removeCanvasInputListeners,
  setInputs,
} from "./TestGame/canvasInputListeners";

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
    const playerEntity = (gameRef.current.entities.playerControlled[0] =
      new MobileEntity(0, "player", 5, 10, {
        x: canvasSize.width / 2,
        y: canvasSize.height / 2,
      }));
    Matter.Composite.add(
      gameRef.current.physicsEngine.world,
      playerEntity.body
    );
    gameRef.current.intervals.physics = setTimeout(() => {
      const context = canvasRef.current?.getContext("2d");
      if (!context || !canvasSizeRef.current) return;
      gameRef.current.stepGame(context, canvasSizeRef.current);
    });

    return () => {
      gameRef.current.clearPhysicsInterval();
    };
  }, [canvasRef, canvasSize.height, canvasSize.width]);

  useEffect(() => {
    if (canvasRef.current) addCanvasInputListeners(document, gameRef.current);
    return () => {
      if (canvasRef.current)
        removeCanvasInputListeners(document, gameRef.current);
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
        // onKeyDown={(e) => setInputs(e, gameRef.current.inputState, true)}
        // onKeyUp={(e) => setInputs(e, gameRef.current.inputState, false)}
      />
    </main>
  );
}
