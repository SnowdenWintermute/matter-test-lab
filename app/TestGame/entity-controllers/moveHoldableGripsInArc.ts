import { angleBetweenPoints, distBetweenTwoPoints, getDirectionAndDiffOfClosestPathToTargetAngle, getPointInArc, moveNumberTowards } from "@/app/utils";
import { AttackStep } from "../entities/Attack";
import { MobileEntity } from "../entities/MobileEntity";
import { Holdable } from "../holdables/Holdable";
import { PointRelativeToBody } from "../holdables/PointRelativeToBody";
import { Vector } from "matter-js";

const angularSpeedInRadians = 0.1;

function moveGripInArc(entity: MobileEntity, grip: Matter.Constraint, step: AttackStep, targetRadius: number) {
  const { position, angle } = entity.body;
  const { arcCenterOffsetFromBody, arcDirection } = step;
  if (!arcCenterOffsetFromBody || typeof arcDirection !== "number") return;
  const arcCenterWorldLocation = Vector.add(Vector.rotateAbout(arcCenterOffsetFromBody, angle, { x: 0, y: 0 }), position); // blue
  const gripAWorldLocation = Vector.add(position, grip.pointA); // white
  const gripDestination = getPointInArc(arcCenterWorldLocation, step.position.angle + angle, targetRadius); // red

  const currentAngle = angleBetweenPoints(arcCenterWorldLocation, gripDestination);
  const targetAngle = step.position.angle + angle;

  const newPosition = Vector.rotateAbout(gripAWorldLocation, angularSpeedInRadians * arcDirection, arcCenterWorldLocation);

  if (currentAngle === targetAngle || !arcCenterOffsetFromBody || typeof targetRadius !== "number") return;
  let newRadius = distBetweenTwoPoints(gripAWorldLocation, arcCenterWorldLocation);
  if (newRadius !== targetRadius) newRadius = moveNumberTowards(newRadius, targetRadius, entity.handSpeed.current / 100);

  grip.pointA.x = newPosition.x - position.x;
  grip.pointA.y = newPosition.y - position.y;
}

export default function moveHoldableGripsInArc(entity: MobileEntity, holdable: Holdable, step: AttackStep) {
  const { arcCenterOffsetFromBody, arcEndingRadius } = step;
  const { distBetweenPairMembers, distBetweenGripPairs } = step.position;
  if (!holdable.grips || !arcCenterOffsetFromBody || !arcEndingRadius) return;
  const { main, support } = holdable.grips;
  moveGripInArc(entity, main.lower, step, arcEndingRadius);
  moveGripInArc(entity, main.upper, step, arcEndingRadius + distBetweenPairMembers);
  if (typeof distBetweenGripPairs !== "number") return;
  if (support?.lower) moveGripInArc(entity, support.lower, step, arcEndingRadius + distBetweenGripPairs + distBetweenPairMembers);
  if (support?.upper) moveGripInArc(entity, support.upper, step, arcEndingRadius + distBetweenPairMembers * 2 + distBetweenGripPairs);
}
