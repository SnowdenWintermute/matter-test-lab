import { distBetweenTwoPoints, getPointInArc } from "../utils";
import { Holdable } from "./holdables/Holdable";

export default function adjustGripPosition(holdable: Holdable) {
  const { grips } = holdable;
  if (!grips.a || !grips.b) return;
  const currentHoldableAngle = holdable.body.angle;
  const distanceBetweenBodyGrips = distBetweenTwoPoints(grips.a.pointA, grips.b.pointA);
  const newGripB = getPointInArc(grips.a.pointB, currentHoldableAngle + Math.PI / 2, distanceBetweenBodyGrips);
  grips.b.pointB.x = newGripB.x;
  grips.b.pointB.y = newGripB.y;
}
