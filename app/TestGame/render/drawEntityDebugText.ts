import { angleBetweenPoints, distBetweenTwoPoints, getPointInArc, movePointTowards, normalizeRadians, roundedStringifiedVector } from "@/app/utils";
import { MobileEntity } from "../entities/MobileEntity";
import { Vector } from "matter-js";
import { PointRelativeToBody } from "../holdables/PointRelativeToBody";
import { OneHandedSword } from "../holdables/OneHandedSword";
import { HoldableGripConstraintCreationData } from "../holdables/Holdable";
import { DamageType, MovementType } from "../entities/Attack";
import drawCircle from "./drawCircle";

export default function drawEntityDebugText(context: CanvasRenderingContext2D, entity: MobileEntity) {
  const { position, angle } = entity.body;
  const holdable = entity.equippedHoldables.rightHand;
  if (!holdable) return;

  const { grips } = holdable;
  const distBetweenGripPairMembers = 10;
  const step = {
    position: new HoldableGripConstraintCreationData({ x: 7, y: -40 }, 0, distBetweenGripPairMembers, 10, 10),
    movementType: MovementType.ARC,
    arcEndingRadius: 20,
    arcCenterOffsetFromBody: { x: 10, y: 10 },
    damageType: DamageType.SLASHING,
  };
  const { arcCenterOffsetFromBody, arcEndingRadius } = step;
  if (!holdable.grips || !arcCenterOffsetFromBody || !arcEndingRadius) return;
  const { main, support } = holdable.grips;

  const arcCenterWorldLocation = Vector.add(Vector.rotateAbout(arcCenterOffsetFromBody, angle, { x: 0, y: 0 }), position);
  drawCircle(context, arcCenterWorldLocation, 4, "blue", false);

  const gripPointARelativeInfo = new PointRelativeToBody(grips!.main.lower.pointA, entity.body);

  const gripAWorldLocation = Vector.add(position, main.lower.pointA);
  drawCircle(context, gripAWorldLocation, 4, "white", true);

  const gripDestination = getPointInArc(arcCenterWorldLocation, step.position.angle + angle, step.arcEndingRadius);
  drawCircle(context, gripDestination, 3, "red", false);

  const destinationLineVector = Vector.sub(arcCenterWorldLocation, gripDestination)
  const currentLineVector = Vector.sub(arcCenterWorldLocation, gripAWorldLocation)
  // const currentAngle = Vector.angle(destinationLineVector, currentLineVector);
  const currentAngle = angleBetweenPoints(arcCenterWorldLocation, gripDestination)
  const targetAngle = step.position.angle + angle

  const newAngle = currentAngle + .2 * 1;
  // const newLocation = getPointInArc(arcCenterWorldLocation, newAngle, distBetweenTwoPoints(arcCenterWorldLocation, gripAWorldLocation))
  const newLocation = Vector.rotateAbout(gripAWorldLocation, -1.2, arcCenterWorldLocation)
  drawCircle(context, newLocation, 4,"orange", false)

  let holdableGripText = "";
  if (holdable.grips?.main.lower.pointA) holdableGripText = roundedStringifiedVector(holdable.grips?.main.lower.pointA);
  const text = [
    // `GRIP POINT A: ${holdableGripText}`,
    // `GRIP POINT A ANGLE: ${normalizeRadians(gripPointARelativeInfo.angleFromBody + angle).toFixed(1)}`,
    `CURR ANGLE: ${currentAngle.toFixed(1)}`,
    `TARGET ANGLE: ${targetAngle.toFixed(1)}`,
    `NEW ANGLE: ${newAngle.toFixed(1)}`,
  ];
  const margin = 18;
  context.fillStyle = "pink";
  context.textAlign = "center";
  text.forEach((string, i) => {
    context.fillText(string, position.x, position.y + 55 + i * margin);
  });
}
