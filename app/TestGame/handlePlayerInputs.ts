import { TestGame } from "../TestGame";
import handleWASD from "./handleWASD";
import handleCombatMoveExecution from "./handleCombatMoveExecution";
import rotatePlayerTowardMouse from "./rotatePlayerTowardMouse";
import cloneDeep from "lodash.clonedeep";
import { EntityStance } from "./entities/MobileEntity";

export default function handlePlayerInputs(game: TestGame) {
  const { entities } = game;
  const playerEntity = entities.playerControlled[0];
  if (game.inputState.shift && !game.prevInputState.shift) {
    if (playerEntity.stance === EntityStance.AT_EASE) playerEntity.stance = EntityStance.COMBAT_READY;
    else if (playerEntity.stance === EntityStance.COMBAT_READY) playerEntity.stance = EntityStance.AT_EASE;
  }
  handleWASD(game);
  rotatePlayerTowardMouse(game, playerEntity);
  handleCombatMoveExecution(game, playerEntity);
  game.prevInputState = cloneDeep(game.inputState);
}
