import { Constraint, Vector } from "matter-js";
import { distBetweenTwoPoints, getPointInArc, movePointTowards } from "../utils";
import { MobileEntity } from "./entities/MobileEntity";
import { HandPosition } from "./entities/HandPosition";

export default function moveHandTowardRestingPosition(entity: MobileEntity, currentHandPosition: Constraint, targetHandPosition: HandPosition) {
  const { body } = entity;
  const { position, angle } = body;
  const restPosition = getPointInArc(position, angle + targetHandPosition.angle, targetHandPosition.distance);
  const offset = Vector.add(position, currentHandPosition.pointA);
  if (distBetweenTwoPoints(offset, restPosition) < 1) {
    currentHandPosition.pointA.x = restPosition.x - position.x;
    currentHandPosition.pointA.y = restPosition.y - position.y;
  } else {
    const { x, y } = movePointTowards(offset, restPosition, 1);
    currentHandPosition.pointA.x = x - position.x;
    currentHandPosition.pointA.y = y - position.y;
  }
}
