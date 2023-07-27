import { TestGame } from "../../TestGame";
import handleWASD from "./handleWASD";
import handleCombatMoveExecution from "./handleCombatMoveExecution";
import rotatePlayerTowardMouse from "./rotatePlayerTowardMouse";
import cloneDeep from "lodash.clonedeep";

export default function handlePlayerInputs(game: TestGame) {
  const { entities } = game;
  const playerEntity = Object.values(entities.playerControlled)[0];
  if (!playerEntity) return console.log("no player entity");
  handleWASD(game, playerEntity);
  rotatePlayerTowardMouse(game, playerEntity);
  handleCombatMoveExecution(game, playerEntity);
  game.prevInputState = cloneDeep(game.inputState);
}
