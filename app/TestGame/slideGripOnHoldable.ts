import { distBetweenTwoPoints, getPointInArc } from "../utils";
import { Holdable } from "./holdables/Holdable";

export default function slideGripOnHoldable(holdable: Holdable) {
  const { grips } = holdable;
  if (!grips) return;
  const { main, support } = grips;
  if (!(main && support)) return;
  const currentHoldableAngle = holdable.body.angle;
  const distBetweenGripPairs = distBetweenTwoPoints(main.upper.pointA, support.lower.pointA);
  const distBetweenSupportPairMembers = distBetweenTwoPoints(support.lower.pointA, support.upper.pointA);
  const newSupportLowerGripB = getPointInArc(main.upper.pointB, currentHoldableAngle + Math.PI / 2, -distBetweenGripPairs);
  const newSupportUpperGripB = getPointInArc(main.upper.pointB, currentHoldableAngle + Math.PI / 2, -distBetweenGripPairs - distBetweenSupportPairMembers);
  support.lower.pointB.x = newSupportLowerGripB.x;
  support.lower.pointB.y = newSupportLowerGripB.y;
  support.upper.pointB.x = newSupportUpperGripB.x;
  support.upper.pointB.y = newSupportUpperGripB.y;
  // grips.b.pointB.x = newGripB.x;
  // grips.b.pointB.y = newGripB.y;
}
