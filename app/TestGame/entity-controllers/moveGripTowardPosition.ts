import { Constraint, Vector } from "matter-js";
import { distBetweenTwoPoints, movePointTowards } from "../../utils";
import { MobileEntity } from "../entities/MobileEntity";
import { PointRelativeToBody } from "../holdables/PointRelativeToBody";

export default function moveGripTowardPosition(entity: MobileEntity, grip: Constraint, targetPositionCreationData: Vector, speed: number) {
  const { body } = entity;
  const { angle } = body;
  const targetPositionRotatedWithBody = Vector.rotateAbout(targetPositionCreationData, angle, { x: 0, y: 0 });
  const distanceToDestination = distBetweenTwoPoints(grip.pointA, targetPositionRotatedWithBody);
  if (distanceToDestination < speed) {
    grip.pointA.x = targetPositionRotatedWithBody.x;
    grip.pointA.y = targetPositionRotatedWithBody.y;
    return true;
  } else {
    const { x, y } = movePointTowards(grip.pointA, targetPositionRotatedWithBody, speed);
    grip.pointA.x = x;
    grip.pointA.y = y;
  }
}
