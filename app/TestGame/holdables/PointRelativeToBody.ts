import { angleBetweenPoints, distBetweenTwoPoints, getPointInArc } from "@/app/utils";
import { Body, Vector } from "matter-js";

export class PointRelativeToBody {
  worldPosition: Vector;
  angleFromBody: number;
  distanceFromBody: number;
  constructor(public offsetFromBody: Vector, body: Body) {
    const zeroVector = { x: 0, y: 0 };
    this.angleFromBody = angleBetweenPoints(zeroVector, offsetFromBody);
    this.distanceFromBody = distBetweenTwoPoints(zeroVector, offsetFromBody);
    this.worldPosition = getPointInArc(body.position, body.angle + this.angleFromBody, this.distanceFromBody);
  }
}
