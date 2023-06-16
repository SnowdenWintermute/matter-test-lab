import { normalizeRadians } from "@/app/utils";
import { MobileEntity } from "../MobileEntity";

export default function drawDebugText(
  context: CanvasRenderingContext2D,
  entity: MobileEntity
) {
  const { position, angle } = entity.body;
  context.fillStyle = "pink";
  context.textAlign = "center";
  const handPositionLineAngle = normalizeRadians(
    Math.atan2(
      entity.desiredLeftHandPosition.pointA.y -
        entity.desiredRightHandPosition.pointA.y,
      entity.desiredLeftHandPosition.pointA.x -
        entity.desiredRightHandPosition.pointA.x
    )
  );
  const normalizedAngle = normalizeRadians(angle);
  const text = [
    `Hand pos angle: ${handPositionLineAngle.toFixed(2)}`,
    `Entity angle: ${normalizedAngle.toFixed(2)}`,
    `Diff: ${normalizeRadians(normalizedAngle - handPositionLineAngle).toFixed(
      2
    )}`,
  ];
  const margin = 18;
  text.forEach((string, i) => {
    context.fillText(string, position.x, position.y + 55 + i * margin);
  });
}
