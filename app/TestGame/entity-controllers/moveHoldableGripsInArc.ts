import {
  angleBetweenPoints,
  distBetweenTwoPoints,
  getAngleFromCenter,
  getClosestAngleDifference,
  getDirectionAndDiffOfClosestPathToTargetAngle,
  getPointInArc,
  moveNumberTowards,
  normalizeRadians,
} from "@/app/utils";
import { AttackStep } from "../entities/Attack";
import { MobileEntity } from "../entities/MobileEntity";
import { Holdable } from "../holdables/Holdable";
import { PointRelativeToBody } from "../holdables/PointRelativeToBody";
import { Vector } from "matter-js";

const angularSpeedInRadians = 0.08;

function moveGripInArc(
  entity: MobileEntity,
  grip: Matter.Constraint,
  step: AttackStep,
  arcCenterWorldLocation: Vector,
  newAngle: number,
  targetRadius: number
) {
  const { position, angle } = entity.body;
  const { arcCenterOffsetFromBody, arcDirection, arcEndingRadius } = step;
  if (!arcCenterOffsetFromBody || typeof arcDirection !== "number" || !arcEndingRadius) return;
  const gripPointAWorldLocation = Vector.add(position, grip.pointA);

  const distArcCenterToCurrentGripLocation = distBetweenTwoPoints(arcCenterWorldLocation, gripPointAWorldLocation);
  let newRadius = distArcCenterToCurrentGripLocation;
  if (distArcCenterToCurrentGripLocation !== step.arcEndingRadius)
    newRadius = moveNumberTowards(distArcCenterToCurrentGripLocation, arcEndingRadius, angularSpeedInRadians);

  const newGripPosition = getPointInArc(arcCenterWorldLocation, newAngle, newRadius);

  grip.pointA.x = newGripPosition.x - position.x;
  grip.pointA.y = newGripPosition.y - position.y;
}

export default function moveHoldableGripsInArc(entity: MobileEntity, holdable: Holdable, step: AttackStep) {
  const { arcCenterOffsetFromBody, arcDirection, arcEndingRadius } = step;
  const { distBetweenPairMembers, distBetweenGripPairs } = step.position;
  if (!holdable.grips || !arcCenterOffsetFromBody || !arcEndingRadius) return;
  const { main, support } = holdable.grips;
  const { angle, position } = entity.body;
  const arcCenterWorldLocation = Vector.add(Vector.rotateAbout(arcCenterOffsetFromBody, angle, { x: 0, y: 0 }), position);
  if (!arcCenterOffsetFromBody || typeof arcDirection !== "number" || !arcEndingRadius) return;
  const gripPointAWorldLocation = Vector.add(position, main.lower.pointA);
  const gripDestination = getPointInArc(arcCenterWorldLocation, step.position.angle + angle, arcEndingRadius);
  const destinationAngle = getAngleFromCenter(arcCenterWorldLocation, gripDestination);
  const currentAngle = getAngleFromCenter(arcCenterWorldLocation, gripPointAWorldLocation);
  const angleDiffToDestination = getClosestAngleDifference(currentAngle, destinationAngle);
  let newAngle = currentAngle;
  let targetAngleReached = false;
  if (Math.abs(angleDiffToDestination) <= angularSpeedInRadians) {
    newAngle = destinationAngle;
    targetAngleReached = true;
  } else if (arcDirection === 1) newAngle += angularSpeedInRadians;
  else if (arcDirection === -1) newAngle -= angularSpeedInRadians;
  moveGripInArc(entity, main.lower, step, arcCenterWorldLocation, newAngle, arcEndingRadius);
  moveGripInArc(entity, main.upper, step, arcCenterWorldLocation, newAngle, arcEndingRadius + distBetweenPairMembers);
  if (typeof distBetweenGripPairs !== "number") return;
  if (support?.lower)
    moveGripInArc(entity, support.lower, step, arcCenterWorldLocation, newAngle, arcEndingRadius + distBetweenGripPairs + distBetweenPairMembers);
  if (support?.upper)
    moveGripInArc(entity, support.upper, step, arcCenterWorldLocation, newAngle, arcEndingRadius + distBetweenPairMembers * 2 + distBetweenGripPairs);

  if (targetAngleReached) return true;
}
