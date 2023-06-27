import { Constraint, Vector } from "matter-js";
import { distBetweenTwoPoints, movePointTowards } from "../utils";
import { MobileEntity } from "./entities/MobileEntity";
import { PointRelativeToBody } from "./holdables/PointRelativeToBody";
import { DistanceAndAngle } from "./common-classes";
import { Holdable } from "./holdables/Holdable";

export default function moveGripTowardPosition(entity: MobileEntity, grip: Constraint, targetPositionCreationData: Vector, speed: number) {
  const { body } = entity;
  const { position } = body;
  const mirroredY = { x: targetPositionCreationData.x, y: targetPositionCreationData.y * -1 };
  const targetPosition = new PointRelativeToBody(mirroredY, body);
  const currentWorldPosition = Vector.add(position, grip.pointA);
  const distanceToDestination = distBetweenTwoPoints(currentWorldPosition, targetPosition.worldPosition);
  if (distanceToDestination < speed) {
    grip.pointA.x = targetPosition.worldPosition.x - position.x;
    grip.pointA.y = targetPosition.worldPosition.y - position.y;
    return true;
  } else {
    const { x, y } = movePointTowards(currentWorldPosition, targetPosition.worldPosition, speed);
    grip.pointA.x = x - position.x;
    grip.pointA.y = y - position.y;
  }
}
