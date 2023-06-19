import { Constraint } from "matter-js";
import { distBetweenTwoPoints, movePointAway, movePointTowards } from "../utils";

export default function adjustGripPosition(rightHand: Constraint, leftHand: Constraint) {
  const handDistance = distBetweenTwoPoints(rightHand.pointA, leftHand.pointA);
  const gripDistance = distBetweenTwoPoints(rightHand.pointB, leftHand.pointB);
  if (Math.abs(gripDistance - handDistance) < 1) return;
  if (gripDistance > handDistance) {
    const { x, y } = movePointTowards(leftHand.pointB, rightHand.pointB, 1);
    leftHand.pointB.x = x;
    leftHand.pointB.y = y;
  } else if (gripDistance < handDistance) {
    const { x, y } = movePointAway(leftHand.pointB, rightHand.pointB, 1);
    leftHand.pointB.x = x;
    leftHand.pointB.y = y;
  }
}
