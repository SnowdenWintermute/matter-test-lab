import { distBetweenTwoPoints, movePointTowards } from "../utils";
import { Holdable } from "./holdables/Holdable";

export default function adjustGripPosition(holdable: Holdable) {
  const { grips } = holdable;
  if (!grips.a || !grips.b) return;
  const bodyGripLocationDistance = distBetweenTwoPoints(grips.a.pointA, grips.b.pointA);
  const gripHoldableDistance = distBetweenTwoPoints(grips.a.pointB, grips.b.pointB);
  const distanceDiff = bodyGripLocationDistance - gripHoldableDistance;
  const newGripBHoldableLocation = movePointTowards(grips.b.pointB, grips.a.pointB, distanceDiff);
  const xDiff = grips.b.pointB.x - newGripBHoldableLocation.x;
  const yDiff = grips.b.pointB.y - newGripBHoldableLocation.y;
  grips.b.pointB.x += xDiff;
  grips.b.pointB.y += yDiff;
}
