import { angleBetweenPoints, distBetweenTwoPoints, getPointInArc, normalizeRadians } from "@/app/utils";
import { MobileEntity } from "../entities/MobileEntity";
import { Vector } from "matter-js";

export default function drawDebugText(context: CanvasRenderingContext2D, entity: MobileEntity) {
  const { position, angle } = entity.body;
  const { spear } = entity;
  context.fillStyle = "pink";
  context.textAlign = "center";
  const normalizedAngle = normalizeRadians(angle);

  // const lhrPositionOffset = Vector.add(spear.leftHandRestingPosition, position);
  // const lhrOffsetDist = distBetweenTwoPoints(lhrPositionOffset, position);
  // const lhrAngleBaseOffset = angleBetweenPoints(lhrPositionOffset, position);
  // const normalizedAngleDiff = normalizeRadians(angle) - normalizeRadians(lhrAngleBaseOffset);
  const lhrp = getPointInArc(position, angle + spear.leftHandRestPosition.angle, spear.leftHandRestPosition.distance);
  const lhDistToRest = distBetweenTwoPoints(Vector.add(position, entity.desiredLeftHandPosition.pointA), lhrp);

  const text = [
    `lhrp: ${lhrp.x.toFixed(1)}, ${lhrp.y.toFixed(1)}`,
    `lhDistToRest: ${lhDistToRest.toFixed(1)}`,
    // `BaseOffset: ${lhrAngleBaseOffset.toFixed(2)}`,
    // `Normalized baseOffset: ${normalizeRadians(lhrAngleBaseOffset).toFixed(2)}`,
    // `Normalized diff to offset: ${normalizedAngleDiff.toFixed(2)}`,
    `Entity angle: ${angle.toFixed(2)}`,
    `Normalized angle: ${normalizedAngle.toFixed(2)}`,
  ];
  const margin = 18;
  text.forEach((string, i) => {
    context.fillText(string, position.x, position.y + 55 + i * margin);
  });
}

// `Hand pos angle: ${handPositionLineAngle.toFixed(2)}`,
// `Diff: ${normalizeRadians(normalizedAngle - handPositionLineAngle).toFixed(
//   2
// )}`,
// `Left grip: ${desiredLeftHandPosition.pointB.y.toFixed(2)}`,
// `Hand position diff: ${distBetweenTwoPoints(desiredRightHandPosition.pointA, desiredLeftHandPosition.pointA).toFixed(2)}`,
// `Grip position diff: ${distBetweenTwoPoints(desiredRightHandPosition.pointB, desiredLeftHandPosition.pointB).toFixed(2)}`,
