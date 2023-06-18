import Matter from "matter-js";
import { TestGame } from ".";
import { getDirectionOfClosestPathToTargetAngle } from "../utils";
import { MobileEntity } from "./MobileEntity";

export default function rotatePlayerTowardMouse(
  game: TestGame,
  entity: MobileEntity
) {
  const { mouseState } = game;
  const { body } = entity;
  const { angle } = body;
  if (mouseState.position) {
    const targetAngle = Math.atan2(
      mouseState.position.y - body.position.y,
      mouseState.position.x - body.position.x
    );
    game.inputState.targetAngle = entity.targetAngle = targetAngle;
    const dir = getDirectionOfClosestPathToTargetAngle(
      angle,
      targetAngle,
      entity.turningSpeed
    );
    if (dir === -1) Matter.Body.setAngle(body, angle - entity.turningSpeed);
    if (dir === 1) Matter.Body.setAngle(body, angle + entity.turningSpeed);
  }
}
