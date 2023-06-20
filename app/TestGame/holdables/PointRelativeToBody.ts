import { angleBetweenPoints, distBetweenTwoPoints, getPointInArc } from "@/app/utils";
import { Body, Vector } from "matter-js";
import { DistanceAndAngle } from "../common-classes";

export class PointRelativeToBody {
  worldPosition: Vector;
  offsetFromBody: Vector;
  angleFromBody: number;
  distanceFromBody: number;
  constructor(creationData: DistanceAndAngle | Vector, body: Body) {
    if (creationData instanceof DistanceAndAngle) {
      this.angleFromBody = creationData.angle;
      this.distanceFromBody = creationData.distance;
      this.worldPosition = getPointInArc(body.position, body.angle + Math.PI + this.angleFromBody, this.distanceFromBody);
      this.offsetFromBody = Vector.sub(body.position, this.worldPosition);
    } else {
      this.offsetFromBody = creationData;
      const zeroVector = { x: 0, y: 0 };
      this.angleFromBody = angleBetweenPoints(zeroVector, this.offsetFromBody);
      this.distanceFromBody = distBetweenTwoPoints(zeroVector, this.offsetFromBody);
      this.worldPosition = getPointInArc(body.position, body.angle + Math.PI + this.angleFromBody, this.distanceFromBody);
    }
  }
}
