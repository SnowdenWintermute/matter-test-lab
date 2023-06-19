import { Constraint, Vector } from "matter-js";
import { distBetweenTwoPoints, getPointInArc, movePointTowards } from "../utils";
import { MobileEntity } from "./entities/MobileEntity";
import { HandPosition } from "./entities/HandPosition";

export default function moveHandTowardPosition(entity: MobileEntity, currentHandPosition: Constraint, targetHandPosition: HandPosition, speed: number) {
  const { body } = entity;
  const { position, angle } = body;
  const targetPosition = getPointInArc(position, angle + targetHandPosition.angle, targetHandPosition.distance);
  const offset = Vector.add(position, currentHandPosition.pointA);
  if (distBetweenTwoPoints(offset, targetPosition) < speed) {
    currentHandPosition.pointA.x = targetPosition.x - position.x;
    currentHandPosition.pointA.y = targetPosition.y - position.y;
  } else {
    const { x, y } = movePointTowards(offset, targetPosition, speed);
    currentHandPosition.pointA.x = x - position.x;
    currentHandPosition.pointA.y = y - position.y;
  }
}
