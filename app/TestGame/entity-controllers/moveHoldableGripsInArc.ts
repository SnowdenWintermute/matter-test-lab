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
import { Holdable, HoldableGripConstraintCreationData } from "../holdables/Holdable";
import { PointRelativeToBody } from "../holdables/PointRelativeToBody";
import { Vector } from "matter-js";
import moveHoldableGripsTowardDestination from "./moveHoldableGripsTowardDestination";

function moveGripInArc(
  entity: MobileEntity,
  grip: Matter.Constraint,
  step: AttackStep,
  arcCenterWorldLocation: Vector,
  newAngle: number,
  targetRadius: number
) {
  const { position } = entity.body;
  const { arcCenterOffsetFromBody, arcDirection, arcEndingRadius } = step;
  if (!arcCenterOffsetFromBody || typeof arcDirection !== "number" || !arcEndingRadius) return;
  const gripPointAWorldLocation = Vector.add(position, grip.pointA);

  const distArcCenterToCurrentGripLocation = distBetweenTwoPoints(arcCenterWorldLocation, gripPointAWorldLocation);
  let newRadius = distArcCenterToCurrentGripLocation;
  if (distArcCenterToCurrentGripLocation !== targetRadius)
    newRadius = moveNumberTowards(distArcCenterToCurrentGripLocation, targetRadius, entity.handSpeed.current / 2);

  const newGripPosition = getPointInArc(arcCenterWorldLocation, newAngle, newRadius);

  grip.pointA.x = newGripPosition.x - position.x;
  grip.pointA.y = newGripPosition.y - position.y;
}

export default function moveHoldableGripsInArc(entity: MobileEntity, holdable: Holdable, step: AttackStep) {
  const { arcCenterOffsetFromBody, arcDirection, arcEndingRadius } = step;
  const { distBetweenPairMembers, distBetweenGripPairs, lowestPointYOffsetFromHoldableBottom } = step.position;
  if (!holdable.grips || !arcCenterOffsetFromBody || !arcEndingRadius) return;
  const { main, support } = holdable.grips;
  const { angle, position } = entity.body;
  const angularSpeedInRadians = (entity.handSpeed.current * 2) / 75;
  const arcCenterWorldLocation = Vector.add(Vector.rotateAbout(arcCenterOffsetFromBody, angle, { x: 0, y: 0 }), position);
  if (!arcCenterOffsetFromBody || typeof arcDirection !== "number" || !arcEndingRadius) return;

  const gripMainLowerWorldLocation = Vector.add(position, main.lower.pointA);
  const gripDestination = getPointInArc(arcCenterWorldLocation, step.position.angle + angle, arcEndingRadius);
  const destinationAngle = getAngleFromCenter(arcCenterWorldLocation, gripDestination);
  const gripMainLowerCurrentAngle = getAngleFromCenter(arcCenterWorldLocation, gripMainLowerWorldLocation);
  const angleDiffToDestination = getClosestAngleDifference(gripMainLowerCurrentAngle, destinationAngle);

  // line up the points first so it doesn't look like the tip of the weapon teleports
  const gripMainUpperWorldLocation = Vector.add(position, main.lower.pointA);
  const gripMainUpperAngle = getAngleFromCenter(arcCenterWorldLocation, gripMainUpperWorldLocation);
  let previousStepHadSameArcCenter = false;
  if (holdable.previousAttackStepArcCenter?.x === arcCenterOffsetFromBody.x && holdable.previousAttackStepArcCenter?.y === arcCenterOffsetFromBody.y) {
    previousStepHadSameArcCenter = true;
  }
  if (!previousStepHadSameArcCenter) {
    const destinationData = new HoldableGripConstraintCreationData(
      getPointInArc(arcCenterOffsetFromBody, step.position.angle, arcEndingRadius),
      step.position.angle,
      distBetweenPairMembers,
      distBetweenGripPairs,
      lowestPointYOffsetFromHoldableBottom
    );
    moveHoldableGripsTowardDestination(entity, holdable, destinationData, entity.handSpeed.current, step);
    return;
  }

  let newAngle = gripMainLowerCurrentAngle;
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

  if (targetAngleReached) {
    // used to determine if next step needs to translate into place or can directly move in an arc
    // otherwise it may look like the holdable teleports from one step to another
    holdable.previousAttackStepArcCenter = arcCenterOffsetFromBody;
    return true;
  }
}
