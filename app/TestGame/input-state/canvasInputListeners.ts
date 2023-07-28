import { Vector } from "matter-js";
import { TestGame } from "../../TestGame";
import { CSPlayerInputState } from "./CSInputState";
import { Hand } from "../entities/MobileEntity";

function handleMouseMove(e: MouseEvent, game: TestGame) {
  if (!game.mouseState.position) game.mouseState.position = Vector.create(0, 0);
  game.mouseState.position.x = e.clientX;
  game.mouseState.position.y = e.clientY;
}

function handleMouseDown(e: MouseEvent, game: TestGame) {
  e.preventDefault();
  if (e.button === 0) {
    game.inputState.mouseLeft = true;
    game.inputState.mouseLeftPressedTimestamp = +Date.now();
  }
}

function handleMouseUp(e: MouseEvent, game: TestGame) {
  e.preventDefault();
  if (e.button !== 0) return;
  const playerEntity = Object.values(game.entities.playerControlled)[0];
  game.inputState.mouseLeft = false;
  const { inputState, mouseState } = game;
  const equippedHoldable = playerEntity.equippedHoldables[Hand.RIGHT];
  if (!equippedHoldable) return;

  const durationHeld = +Date.now() - (inputState.mouseLeftPressedTimestamp || 0);
  const heavyAttackHoldDurationThreshold = 500;
  const mouseLeftReleased = game.prevInputState.mouseLeft && !inputState.mouseLeft && durationHeld;

  if (durationHeld >= heavyAttackHoldDurationThreshold) {
    console.log("heavy attack input received");
  } else mouseState.clicksQueued.left += 1;

  if (mouseLeftReleased || durationHeld >= heavyAttackHoldDurationThreshold) inputState.mouseLeftPressedTimestamp = null;
}

export function setInputs(e: KeyboardEvent, inputs: CSPlayerInputState, active: boolean) {
  const { code } = e;
  e.preventDefault();
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
  canvas.addEventListener("mousedown", (e) => handleMouseDown(e, game));
  canvas.addEventListener("mouseup", (e) => handleMouseUp(e, game));
}

export function removeCanvasInputListeners(document: Document, canvas: HTMLCanvasElement, game: TestGame) {
  document.removeEventListener("keydown", (e) => setInputs(e, game.inputState, true));
  document.removeEventListener("keyup", (e) => setInputs(e, game.inputState, false));
  canvas.removeEventListener("mousemove", (e) => handleMouseMove(e, game));
  canvas.removeEventListener("mousedown", (e) => handleMouseDown(e, game));
  canvas.removeEventListener("mouseup", (e) => handleMouseUp(e, game));
}
