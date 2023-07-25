import {
  angleBetweenPoints,
  distBetweenTwoPoints,
  getAngleFromCenter,
  getClosestAngleDifference,
  getNormalizedAngleDiff,
  getPointInArc,
  movePointTowards,
  normalizeRadians,
  roundedStringifiedVector,
} from "@/app/utils";
import { MobileEntity } from "../entities/MobileEntity";
import { Vector } from "matter-js";
import { PointRelativeToBody } from "../holdables/PointRelativeToBody";
import { OneHandedSword } from "../holdables/OneHandedSword";
import { HoldableGripConstraintCreationData } from "../holdables/Holdable";
import { DamageType, MovementType } from "../entities/Attack";
import drawCircle from "./drawCircle";
import { TestGame } from "..";

export default function drawEntityDebugText(context: CanvasRenderingContext2D, entity: MobileEntity, game: TestGame) {
  const { position, angle } = entity.body;
  const holdable = entity.equippedHoldables.rightHand;
  if (!holdable) return;

  // if (!entity.currentAttackExecuting) return;
  // const { currentStepIndex } = entity.currentAttackExecuting;
  // const step = entity.currentAttackExecuting!.instructionSet.steps[currentStepIndex];
  // // console.log(entity.currentAttackExecuting.currentStepIndex, step.position.angle);
  // const { arcCenterOffsetFromBody, arcEndingRadius } = step;
  // if (!holdable.grips || !arcCenterOffsetFromBody || !arcEndingRadius) return;
  // const { main, support } = holdable.grips;

  // const arcCenterWorldLocation = Vector.add(Vector.rotateAbout(arcCenterOffsetFromBody, angle, { x: 0, y: 0 }), position);
  // // // drawCircle(context, arcCenterWorldLocation, 4, "blue", false);
  // const gripAWorldLocation = Vector.add(position, main.upper.pointA);
  // // // drawCircle(context, gripAWorldLocation, 7, "white", true);
  // // const gripDestination = getPointInArc(arcCenterWorldLocation, step.position.angle + angle, step.arcEndingRadius!);
  // // // drawCircle(context, gripDestination, 3, "cyan", false);

  // // const currentAngle = getAngleFromCenter(arcCenterWorldLocation, gripAWorldLocation);

  // const currDist = distBetweenTwoPoints(arcCenterWorldLocation, gripAWorldLocation);
  // // drawCircle(context, newLocation, 4, "orange", false);
  // // const destinationAngle = normalizeRadians(step.position.angle + angle);
  // const destinationAngle = getAngleFromCenter(arcCenterWorldLocation, gripDestination);
  const text = [
    `CLICKS QUEUED: ${game.mouseState.clicksQueued.left}`,
    // `STEP: ${currentStepIndex}`,
    // `DIST: ${currDist}`,
    // `DESIRED: ${step.arcEndingRadius}`,
    // `CREATION: ${destinationAngle.toFixed(1)}`,
    // `CURR: ${currentAngle.toFixed(1)}`,
    // `DIFF: ${getClosestAngleDifference(currentAngle, destinationAngle).toFixed(1)}`,
  ];
  const margin = 18;
  context.fillStyle = "pink";
  context.textAlign = "center";
  text.forEach((string, i) => {
    context.fillText(string, position.x, position.y + 55 + i * margin);
  });
}
