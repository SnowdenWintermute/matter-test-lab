import { Constraint, Vector } from "matter-js";
import { distBetweenTwoPoints, movePointTowards } from "../utils";
import { MobileEntity } from "./entities/MobileEntity";
import { PointRelativeToBody } from "./holdables/PointRelativeToBody";
import { DistanceAndAngle } from "./common-classes";
import { Holdable } from "./holdables/Holdable";

export default function moveGripTowardPosition(
  entity: MobileEntity,
  currentPosition: Constraint,
  targetPositionCreationData: Vector | DistanceAndAngle,
  speed: number
) {
  const { body } = entity;
  const { position } = body;
  const targetPosition = new PointRelativeToBody(targetPositionCreationData, body);
  const currentWorldPosition = Vector.add(position, currentPosition.pointA);
  const distanceToDestination = distBetweenTwoPoints(currentWorldPosition, targetPosition.worldPosition);
  if (distanceToDestination < speed) {
    currentPosition.pointA.x = targetPosition.worldPosition.x - position.x;
    currentPosition.pointA.y = targetPosition.worldPosition.y - position.y;
    return true;
  } else {
    const { x, y } = movePointTowards(currentWorldPosition, targetPosition.worldPosition, speed);
    currentPosition.pointA.x = x - position.x;
    currentPosition.pointA.y = y - position.y;
  }
}
