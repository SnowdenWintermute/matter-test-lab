import Matter from "matter-js";
import { TestGame } from "../TestGame";
import handleWASD from "./handleWASD";
import { CombatMoveExecutionState } from "./MobileEntity";
import handleCombatMoveExecution from "./handleCombatMoveExecution";
import { normalizeRadians } from "../utils";

export default function handlePlayerInputs(game: TestGame) {
  const { entities } = game;
  const playerEntity = entities.playerControlled[0];
  const { body } = playerEntity;
  const { angle } = body;
  handleWASD(game);

  const { mouseState } = game;
  if (mouseState.position) {
    const targetAngle = Math.atan2(
      mouseState.position.y - body.position.y,
      mouseState.position.x - body.position.x
    );
    game.inputState.targetAngle = playerEntity.targetAngle = targetAngle;
    const normalizedAngle = normalizeRadians(angle);
    const normalizedTarget = normalizeRadians(targetAngle);
    const difference = normalizedTarget - normalizedAngle;
    let dir = 0;
    if (Math.abs(difference) < playerEntity.turningSpeed) dir = 0;
    else if (Math.abs(difference) <= Math.PI) dir = Math.sign(difference);
    else dir = -Math.sign(difference);
    if (dir === -1)
      Matter.Body.setAngle(body, angle - playerEntity.turningSpeed);
    if (dir === 1)
      Matter.Body.setAngle(body, angle + playerEntity.turningSpeed);
    handleCombatMoveExecution(game, playerEntity);
  }
}
