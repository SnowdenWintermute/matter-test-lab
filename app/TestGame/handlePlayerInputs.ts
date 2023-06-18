import Matter from "matter-js";
import { TestGame } from "../TestGame";
import handleWASD from "./handleWASD";
import { CombatMoveExecutionState } from "./MobileEntity";
import handleCombatMoveExecution from "./handleCombatMoveExecution";
import { normalizeRadians } from "../utils";
import rotatePlayerTowardMouse from "./rotatePlayerTowardMouse";

export default function handlePlayerInputs(game: TestGame) {
  const { entities } = game;
  const playerEntity = entities.playerControlled[0];
  const { body } = playerEntity;
  const { angle } = body;
  handleWASD(game);
  rotatePlayerTowardMouse(game, playerEntity);
  handleCombatMoveExecution(game, playerEntity);
}
