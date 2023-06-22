import { angleBetweenPoints, distBetweenTwoPoints, getPointInArc, movePointTowards, normalizeRadians } from "@/app/utils";
import { MobileEntity } from "../entities/MobileEntity";
import { Vector } from "matter-js";

export default function drawDebugText(context: CanvasRenderingContext2D, entity: MobileEntity) {
  const { position, angle } = entity.body;
  context.fillStyle = "pink";
  context.textAlign = "center";
  const spear = entity.equippedHoldables.rightHand;
  if (!spear) return;

  const { grips } = spear;
  if (!grips.b || !grips.a) return;

  const bodyGripLocationDistance = distBetweenTwoPoints(grips.a.pointA, grips.b.pointA);
  const gripHoldableDistance = distBetweenTwoPoints(grips.a.pointB, grips.b.pointB);
  const distanceDiff = bodyGripLocationDistance - gripHoldableDistance;
  const newGripBHoldableLocation = movePointTowards(grips.b.pointB, grips.a.pointB, distanceDiff);

  const text = [
    `bodyGripLocationDistance: ${bodyGripLocationDistance.toFixed(1)}`,
    `gripHoldableDistance: ${gripHoldableDistance.toFixed(1)}`,
    `distanceDiff: ${distanceDiff.toFixed(1)}`,
    `current grip B: ${grips.b.pointB.x.toFixed(1)}, ${grips.b.pointB.y.toFixed(1)}`,
    `newGripBLocation: ${newGripBHoldableLocation.x.toFixed(1)}, ${newGripBHoldableLocation.y.toFixed(1)}`,
  ];
  const margin = 18;
  text.forEach((string, i) => {
    context.fillText(string, position.x, position.y + 55 + i * margin);
  });
}
