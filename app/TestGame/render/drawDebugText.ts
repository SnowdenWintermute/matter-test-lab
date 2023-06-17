import { distBetweenTwoPoints, normalizeRadians } from "@/app/utils";
import { MobileEntity } from "../MobileEntity";
import { Vector } from "matter-js";

export default function drawDebugText(
  context: CanvasRenderingContext2D,
  entity: MobileEntity
) {
  const { position, angle } = entity.body;
  const { desiredLeftHandPosition, desiredRightHandPosition } = entity;
  context.fillStyle = "pink";
  context.textAlign = "center";
  const handPositionLineAngle = normalizeRadians(
    Math.atan2(
      desiredLeftHandPosition.pointA.y - desiredRightHandPosition.pointA.y,
      desiredLeftHandPosition.pointA.x - desiredRightHandPosition.pointA.x
    )
  );
  const normalizedAngle = normalizeRadians(angle);
  const text = [
    `Left grip: ${desiredLeftHandPosition.pointB.y}`,
    `Hand position diff: ${distBetweenTwoPoints(
      desiredRightHandPosition.pointA,
      desiredLeftHandPosition.pointA
    ).toFixed(2)}`,
    `Grip position diff: ${distBetweenTwoPoints(
      desiredRightHandPosition.pointB,
      desiredLeftHandPosition.pointB
    ).toFixed(2)}`,
  ];
  const margin = 18;
  text.forEach((string, i) => {
    context.fillText(string, position.x, position.y + 55 + i * margin);
  });
}

// `Hand pos angle: ${handPositionLineAngle.toFixed(2)}`,
// `Entity angle: ${normalizedAngle.toFixed(2)}`,
// `Diff: ${normalizeRadians(normalizedAngle - handPositionLineAngle).toFixed(
//   2
// )}`,
