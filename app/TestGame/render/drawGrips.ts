import { Vector } from "matter-js";
import { Holdable } from "../holdables/Holdable";
import drawPoly from "./drawPoly";
import drawCircle from "./drawCircle";
import { MobileEntity } from "../entities/MobileEntity";

export default function drawGrips(context: CanvasRenderingContext2D, holdable: Holdable, entity: MobileEntity) {
  const { position } = entity.body;
  drawPoly(context, holdable.body.vertices, "white");
  const { grips } = holdable;
  context.lineWidth = 2;
  let pointToDraw;
  if (grips.a) {
    pointToDraw = Vector.add(position, grips.a.pointA);
    drawCircle(context, pointToDraw, 5, "black", false);
    pointToDraw = Vector.add(holdable.body.position, grips.a.pointB);
    drawCircle(context, pointToDraw, 5, "rgba(0,0,0,.5)", true);
  }
  if (grips.b) {
    pointToDraw = Vector.add(position, grips.b.pointA);
    drawCircle(context, pointToDraw, 5, "red", false);
    context.textAlign = "center";
    context.textBaseline = "middle";
    pointToDraw = Vector.add(holdable.body.position, grips.b.pointB);
    drawCircle(context, pointToDraw, 5, "rgba(255,0,0,.5)", true);
    context.fillText("B", grips.b.pointA.x + position.x, grips.b.pointA.y + position.y);
  }

  // const lhrp = getPointInArc(position, angle + spear.leftHandRestPosition.angle, spear.leftHandRestPosition.distance);
  // const rhrp = getPointInArc(position, angle + spear.rightHandRestPosition.angle, spear.rightHandRestPosition.distance);
  // drawCircle(context, lhrp, 3, "blue", true);
  // drawCircle(context, rhrp, 3, "orange", true);
  // const lhrdp = getPointInArc(position, angle + spear.leftHandReadyPosition.angle, spear.leftHandReadyPosition.distance);
  // const rhrdp = getPointInArc(position, angle + spear.rightHandReadyPosition.angle, spear.rightHandReadyPosition.distance);
  // drawCircle(context, lhrdp, 3, "cyan", true);
  // drawCircle(context, rhrdp, 3, "yellow", true);
}
