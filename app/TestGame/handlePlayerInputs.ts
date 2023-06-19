import { TestGame } from "../TestGame";
import handleWASD from "./handleWASD";
import handleCombatMoveExecution from "./handleCombatMoveExecution";
import rotatePlayerTowardMouse from "./rotatePlayerTowardMouse";

export default function handlePlayerInputs(game: TestGame) {
  const { entities } = game;
  const playerEntity = entities.playerControlled[0];
  handleWASD(game);
  rotatePlayerTowardMouse(game, playerEntity);
  handleCombatMoveExecution(game, playerEntity);
}
