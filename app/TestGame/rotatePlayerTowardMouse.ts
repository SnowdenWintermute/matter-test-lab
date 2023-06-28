import { Body, Vector } from "matter-js";
import { TestGame } from ".";
import { getDirectionOfClosestPathToTargetAngle } from "../utils";
import { MobileEntity } from "./entities/MobileEntity";

export default function rotatePlayerTowardMouse(game: TestGame, entity: MobileEntity) {
  const { mouseState } = game;
  const { body } = entity;
  const { angle } = body;
  if (mouseState.position) {
    const targetAngle = Math.atan2(mouseState.position.y - body.position.y, mouseState.position.x - body.position.x);
    game.inputState.targetAngle = entity.targetAngle = targetAngle;
    const dir = getDirectionOfClosestPathToTargetAngle(angle, targetAngle, entity.turningSpeed.current * 2);
    // if (dir !== 0) body.isStatic = false;
    if (dir === -1) {
      Body.applyForce(body, Vector.add(body.position, Vector.create(-20, 0)), Vector.create(0, entity.turningSpeed.current / 2));
      Body.applyForce(body, Vector.add(body.position, Vector.create(20, 0)), Vector.create(0, -entity.turningSpeed.current / 2));
    }
    if (dir === 1) {
      Body.applyForce(body, Vector.add(body.position, Vector.create(-20, 0)), Vector.create(0, -entity.turningSpeed.current / 2));
      Body.applyForce(body, Vector.add(body.position, Vector.create(20, 0)), Vector.create(0, entity.turningSpeed.current / 2));
    }
  }
}
