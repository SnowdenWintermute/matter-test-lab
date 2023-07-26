import { Vector } from "matter-js";
import { AttackStep } from "../entities/Attack";
import { MobileEntity } from "../entities/MobileEntity";
import { distBetweenTwoPoints, getPointInArc, moveNumberTowards } from "@/app/utils";

export function moveGripInArc(
  entity: MobileEntity,
  grip: Matter.Constraint,
  step: AttackStep,
  arcCenterWorldLocation: Vector,
  newAngle: number,
  targetRadius: number,
  speedToApproachTargetRadius: number
) {
  const { position } = entity.body;
  const { arcCenterOffsetFromBody, arcDirection, arcEndingRadius } = step;
  if (!arcCenterOffsetFromBody || typeof arcDirection !== "number" || !arcEndingRadius) return;
  const gripPointAWorldLocation = Vector.add(position, grip.pointA);

  const distArcCenterToCurrentGripLocation = distBetweenTwoPoints(arcCenterWorldLocation, gripPointAWorldLocation);
  let newRadius = distArcCenterToCurrentGripLocation;
  if (distArcCenterToCurrentGripLocation !== targetRadius)
    newRadius = moveNumberTowards(distArcCenterToCurrentGripLocation, targetRadius, speedToApproachTargetRadius);

  const newGripPosition = getPointInArc(arcCenterWorldLocation, newAngle, newRadius);

  grip.pointA.x = newGripPosition.x - position.x;
  grip.pointA.y = newGripPosition.y - position.y;
}
