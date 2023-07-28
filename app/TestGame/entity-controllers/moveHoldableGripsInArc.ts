import { getAngleFromCenter, getClosestAngleDifference, getPointInArc } from "@/app/utils";
import { AttackStep } from "../entities/Attack";
import { MobileEntity } from "../entities/MobileEntity";
import { Holdable, HoldableType } from "../holdables/Holdable";
import { Vector } from "matter-js";
import moveHoldableGripsTowardDestination from "./moveHoldableGripsTowardDestination";
import { moveGripInArc } from "./moveGripInArc";
import { HoldableGripConstraintCreationData } from "../holdables/HoldableGripConstraintCreationData";

function setPreviousArcCenterAndMovementType(holdable: Holdable, step: AttackStep) {
  // used to determine if next step needs to translate into place or can directly move in an arc
  // otherwise it may look like the holdable teleports from one step to another
  if (!step.arcMovementParameters) return;
  const { arcCenterOffsetFromBody } = step.arcMovementParameters;
  holdable.previousAttackStep.arcCenter = arcCenterOffsetFromBody;
  holdable.previousAttackStep.movementType = step.movementType;
  return true;
}

export default function moveHoldableGripsInArc(entity: MobileEntity, holdable: Holdable, step: AttackStep, options?: { perpendicularGrips?: boolean }) {
  const perpendicularGrips = options?.perpendicularGrips;
  if (!step.arcMovementParameters) return;
  const { arcCenterOffsetFromBody, arcDirection, arcEndingRadius } = step.arcMovementParameters;
  const { distBetweenPairMembers, distBetweenGripPairs, lowestPointYOffsetFromHoldableBottom } = step.position;
  if (!holdable.grips) return;
  const { main, support } = holdable.grips;
  const { angle, position } = entity.body;
  const angularSpeedInRadians = (entity.handSpeed.current * 2) / 75; // ARC SPEED HERE
  const arcCenterWorldLocation = Vector.add(Vector.rotateAbout(arcCenterOffsetFromBody, angle, { x: 0, y: 0 }), position);

  const gripMainLowerWorldLocation = Vector.add(position, main.lower.pointA);
  const gripDestination = getPointInArc(arcCenterWorldLocation, step.position.angle + angle, arcEndingRadius);
  const destinationAngle = getAngleFromCenter(arcCenterWorldLocation, gripDestination);
  const gripMainLowerCurrentAngle = getAngleFromCenter(arcCenterWorldLocation, gripMainLowerWorldLocation);
  const angleDiffToDestination = getClosestAngleDifference(gripMainLowerCurrentAngle, destinationAngle);

  // line up the points first so it doesn't look like the tip of the weapon teleports
  let previousStepHadSameArcCenter = false;
  if (holdable.previousAttackStep.arcCenter?.x === arcCenterOffsetFromBody.x && holdable.previousAttackStep.arcCenter?.y === arcCenterOffsetFromBody.y)
    previousStepHadSameArcCenter = true;
  const previousStepHadSameMovementType = holdable.previousAttackStep.movementType === step.movementType;

  const gripsAngle = perpendicularGrips ? step.position.angle - Math.PI / 2 : step.position.angle;
  if (holdable.type === HoldableType.SHIELD) console.log(gripsAngle, angleDiffToDestination);

  if (!previousStepHadSameArcCenter || !previousStepHadSameMovementType) {
    const destinationData = new HoldableGripConstraintCreationData(
      getPointInArc(arcCenterOffsetFromBody, step.position.angle, arcEndingRadius),
      gripsAngle,
      distBetweenPairMembers,
      distBetweenGripPairs,
      lowestPointYOffsetFromHoldableBottom
    );
    const reachedDestination = moveHoldableGripsTowardDestination(entity, holdable, destinationData, entity.handSpeed.current);
    if (reachedDestination) return setPreviousArcCenterAndMovementType(holdable, step);
    return;
  }

  let newAngle = gripMainLowerCurrentAngle;
  let targetAngleReached = false;
  if (Math.abs(angleDiffToDestination) <= angularSpeedInRadians) {
    newAngle = destinationAngle;
    targetAngleReached = true;
  } else if (arcDirection === 1) newAngle += angularSpeedInRadians;
  else if (arcDirection === -1) newAngle -= angularSpeedInRadians;

  if (targetAngleReached) return setPreviousArcCenterAndMovementType(holdable, step);

  let speedToApproachTargetRadius = entity.handSpeed.current / 2;
  moveGripInArc(entity, main.lower, step, arcCenterWorldLocation, newAngle, arcEndingRadius, speedToApproachTargetRadius);
  let modifiedAngle = newAngle;
  let mainUpperDist = distBetweenPairMembers + arcEndingRadius;
  let supportLowerDist = distBetweenPairMembers + (distBetweenGripPairs || 0) + arcEndingRadius;
  let supportUpperDist = distBetweenPairMembers * 2 + (distBetweenGripPairs || 0) + arcEndingRadius;
  let arcCenter = arcCenterWorldLocation;
  if (perpendicularGrips) {
    modifiedAngle = newAngle - Math.PI / 2;
    mainUpperDist -= arcEndingRadius;
    supportLowerDist -= arcEndingRadius;
    supportUpperDist -= arcEndingRadius;
    arcCenter = Vector.add(main.lower.pointA, position);
    speedToApproachTargetRadius = 99; // basically instant
  }

  moveGripInArc(entity, main.upper, step, arcCenter, modifiedAngle, mainUpperDist, speedToApproachTargetRadius);
  if (support) {
    moveGripInArc(entity, support.lower, step, arcCenter, modifiedAngle, supportLowerDist, speedToApproachTargetRadius);
    moveGripInArc(entity, support.upper, step, arcCenter, modifiedAngle, supportUpperDist, speedToApproachTargetRadius);
  }
}
