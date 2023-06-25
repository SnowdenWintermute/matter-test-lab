import { Vector } from "matter-js";
import { angleBetweenPoints, distBetweenTwoPoints, getPointInArc, movePointTowards } from "../utils";
import { Holdable } from "./holdables/Holdable";
import { MobileEntity } from "./entities/MobileEntity";
import { PointRelativeToBody } from "./holdables/PointRelativeToBody";

export default function adjustGripPosition(holdable: Holdable, entity: MobileEntity, speed: number) {
  const { grips, positionOptions } = holdable;
  if (!grips.a || !grips.b || !holdable.heldBy) return;

  const currentHoldableAngle = holdable.body.angle;
  const distanceBetweenBodyGrips = distBetweenTwoPoints(grips.a.pointA, grips.b.pointA);
  const newGripB = getPointInArc(grips.a.pointB, currentHoldableAngle + Math.PI / 2, distanceBetweenBodyGrips);
  grips.b.pointB.x = newGripB.x;
  grips.b.pointB.y = newGripB.y;
}
