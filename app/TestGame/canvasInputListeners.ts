import { Vector } from "matter-js";
import { TestGame } from "../TestGame";
import { CSPlayerInputState } from "./CSInputState";

function handleMouseMove(e: MouseEvent, game: TestGame) {
  if (!game.mouseState.position) game.mouseState.position = Vector.create(0, 0);
  game.mouseState.position.x = e.clientX;
  game.mouseState.position.y = e.clientY;
}

export function setInputs(e: KeyboardEvent, inputs: CSPlayerInputState, active: boolean) {
  const { code } = e;
  if (code === "KeyW") inputs.up = active;
  if (code === "KeyS") inputs.down = active;
  if (code === "KeyA") inputs.left = active;
  if (code === "KeyD") inputs.right = active;
  if (code === "KeyJ") inputs.turnLeft = active;
  if (code === "KeyK") inputs.turnRight = active;
  if (code === "Space") inputs.space = active;
  if (code === "ArrowUp") inputs.arrowUp = active;
  if (code === "ArrowDown") inputs.arrowDown = active;
  if (code === "ArrowLeft") inputs.arrowLeft = active;
  if (code === "ArrowRight") inputs.arrowRight = active;
  if (code === "ShiftLeft") inputs.shift = active;
}

export function addCanvasInputListeners(document: Document, canvas: HTMLCanvasElement, game: TestGame) {
  document.addEventListener("keydown", (e) => setInputs(e, game.inputState, true));
  document.addEventListener("keyup", (e) => setInputs(e, game.inputState, false));
  canvas.addEventListener("mousemove", (e) => handleMouseMove(e, game));
}

export function removeCanvasInputListeners(document: Document, canvas: HTMLCanvasElement, game: TestGame) {
  document.removeEventListener("keydown", (e) => setInputs(e, game.inputState, true));
  document.removeEventListener("keyup", (e) => setInputs(e, game.inputState, false));
  canvas.removeEventListener("mousemove", (e) => handleMouseMove(e, game));
}
