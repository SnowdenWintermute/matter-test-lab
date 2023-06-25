import { angleBetweenPoints, distBetweenTwoPoints, getPointInArc, movePointTowards, normalizeRadians, roundedStringifiedVector } from "@/app/utils";
import { MobileEntity } from "../entities/MobileEntity";
import { Vector } from "matter-js";
import { PointRelativeToBody } from "../holdables/PointRelativeToBody";

export default function drawDebugText(context: CanvasRenderingContext2D, entity: MobileEntity) {
  const { position, angle } = entity.body;
  context.fillStyle = "pink";
  context.textAlign = "center";
  const spear = entity.equippedHoldables.rightHand;
  if (!spear) return;

  const { grips } = spear;
  if (!grips.b || !grips.a) return;

  const currentHoldableAngle = spear.body.angle;
  // get the distance between the gripAs
  const distanceBetweenBodyGrips = distBetweenTwoPoints(grips.a.pointA, grips.b.pointA);
  const newGripB = getPointInArc(grips.a.pointB, currentHoldableAngle + Math.PI / 2, distanceBetweenBodyGrips);

  const text = [
    `SPEAR ANGLE: ${currentHoldableAngle.toFixed(1)}`,
    `DIST BODY GRIPS: ${distanceBetweenBodyGrips.toFixed(1)}`,
    `NEW GRIP B: ${roundedStringifiedVector(newGripB)}`,
    // `GRIP A A: ${roundedStringifiedVector(grips.a.pointA)}`,
    // `GRIP A B: ${roundedStringifiedVector(grips.a.pointB)}`,
    // `GRIP B A: ${roundedStringifiedVector(grips.b.pointA)}`,
    `GRIP B B: ${roundedStringifiedVector(grips.b.pointB)}`,
  ];
  const margin = 18;
  text.forEach((string, i) => {
    context.fillText(string, position.x, position.y + 55 + i * margin);
  });
}
