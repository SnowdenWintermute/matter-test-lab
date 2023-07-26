import { getAngleFromCenter, getClosestAngleDifference, getPointInArc } from "@/app/utils";
import { AttackStep } from "../entities/Attack";
import { MobileEntity } from "../entities/MobileEntity";
import { Holdable } from "../holdables/Holdable";
import { Vector } from "matter-js";
import moveHoldableGripsTowardDestination from "./moveHoldableGripsTowardDestination";
import { moveGripInArc } from "./moveGripInArc";
import { HoldableGripConstraintCreationData } from "../holdables/HoldableGripConstraintCreationData";

export default function moveHoldableGripsInArc(entity: MobileEntity, holdable: Holdable, step: AttackStep, perpendicularGrips?: boolean) {
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
  let previousStepHadSameArcCenter = false;
  if (holdable.previousAttackStep.arcCenter?.x === arcCenterOffsetFromBody.x && holdable.previousAttackStep.arcCenter?.y === arcCenterOffsetFromBody.y)
    previousStepHadSameArcCenter = true;
  const previousStepHadSameMovementType = holdable.previousAttackStep.movementType === step.movementType;
  console.log(previousStepHadSameMovementType);
  if (!previousStepHadSameArcCenter || !previousStepHadSameMovementType) {
    const destinationData = new HoldableGripConstraintCreationData(
      getPointInArc(arcCenterOffsetFromBody, step.position.angle, arcEndingRadius),
      step.position.angle,
      distBetweenPairMembers,
      distBetweenGripPairs,
      lowestPointYOffsetFromHoldableBottom
    );
    const reachedDestination = moveHoldableGripsTowardDestination(entity, holdable, destinationData, entity.handSpeed.current, step);
    if (reachedDestination) {
      // used to determine if next step needs to translate into place or can directly move in an arc
      // otherwise it may look like the holdable teleports from one step to another
      holdable.previousAttackStep.arcCenter = step?.arcCenterOffsetFromBody;
      holdable.previousAttackStep.movementType = step?.movementType;
    }
    return;
  }

  let newAngle = gripMainLowerCurrentAngle;
  let targetAngleReached = false;
  if (Math.abs(angleDiffToDestination) <= angularSpeedInRadians) {
    newAngle = destinationAngle;
    targetAngleReached = true;
  } else if (arcDirection === 1) newAngle += angularSpeedInRadians;
  else if (arcDirection === -1) newAngle -= angularSpeedInRadians;

  if (targetAngleReached) {
    console.log("target angle reached");
    // used to determine if next step needs to translate into place or can directly move in an arc
    // otherwise it may look like the holdable teleports from one step to another
    holdable.previousAttackStep.arcCenter = arcCenterOffsetFromBody;
    holdable.previousAttackStep.movementType = step.movementType;
    return true;
  }

  const speedToApproachTargetRadius = entity.handSpeed.current / 2;
  moveGripInArc(entity, main.lower, step, arcCenterWorldLocation, newAngle, arcEndingRadius, speedToApproachTargetRadius);
  if (!perpendicularGrips) {
    moveGripInArc(entity, main.upper, step, arcCenterWorldLocation, newAngle, arcEndingRadius + distBetweenPairMembers, speedToApproachTargetRadius);
    if (typeof distBetweenGripPairs !== "number") return;
    if (support?.lower)
      moveGripInArc(
        entity,
        support.lower,
        step,
        arcCenterWorldLocation,
        newAngle,
        arcEndingRadius + distBetweenGripPairs + distBetweenPairMembers,
        speedToApproachTargetRadius
      );
    if (support?.upper)
      moveGripInArc(
        entity,
        support.upper,
        step,
        arcCenterWorldLocation,
        newAngle,
        arcEndingRadius + distBetweenPairMembers * 2 + distBetweenGripPairs,
        speedToApproachTargetRadius
      );
  } else {
    const instantSpeed = 99;
    const perpendicularAngle = newAngle - Math.PI / 2;
    moveGripInArc(entity, main.upper, step, Vector.add(main.lower.pointA, position), perpendicularAngle, distBetweenPairMembers, instantSpeed);
    if (typeof distBetweenGripPairs !== "number") return;
    if (support?.lower)
      moveGripInArc(
        entity,
        support.lower,
        step,
        Vector.add(main.lower.pointA, position),
        perpendicularAngle,
        distBetweenPairMembers + distBetweenGripPairs,
        instantSpeed
      );
    if (support?.upper)
      moveGripInArc(
        entity,
        support.upper,
        step,
        Vector.add(main.lower.pointA, position),
        perpendicularAngle,
        distBetweenGripPairs * 2 + distBetweenPairMembers,
        instantSpeed
      );
  }
}
