import { TestGame } from "../TestGame";
import { CSPlayerInputState } from "./CSInputState";

export function setInputs(
  e: KeyboardEvent,
  inputs: CSPlayerInputState,
  active: boolean
) {
  const { code } = e;
  console.log(e.code, active);
  if (code === "KeyW") inputs.up = active;
  if (code === "KeyS") inputs.down = active;
  if (code === "KeyA") inputs.left = active;
  if (code === "KeyD") inputs.right = active;
  if (code === "Space") inputs.space = active;
  if (code === "KeyJ") inputs.turnLeft = active;
  if (code === "KeyK") inputs.turnRight = active;
}

export function addCanvasInputListeners(document: Document, game: TestGame) {
  document.addEventListener("keydown", (e) =>
    setInputs(e, game.inputState, true)
  );
  document.addEventListener("keyup", (e) =>
    setInputs(e, game.inputState, false)
  );
}

export function removeCanvasInputListeners(document: Document, game: TestGame) {
  console.log("removing listeners");
  document.removeEventListener("keydown", (e) =>
    setInputs(e, game.inputState, true)
  );
  document.removeEventListener("keyup", (e) =>
    setInputs(e, game.inputState, false)
  );
}
