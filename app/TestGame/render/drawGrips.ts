import { Vector } from "matter-js";
import { Holdable } from "../holdables/Holdable";
import drawPoly from "./drawPoly";
import drawCircle from "./drawCircle";
import { MobileEntity } from "../entities/MobileEntity";

export default function drawGrips(context: CanvasRenderingContext2D, holdable: Holdable, entity: MobileEntity) {
  const { position } = entity.body;
  drawPoly(context, holdable.body.vertices, "white");
  drawCircle(context, holdable.body.position, 3, "black", true);
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
    drawCircle(context, pointToDraw, 5, "rgba(0,255,0,.5)", true);
    context.fillText("B", grips.b.pointA.x + position.x, grips.b.pointA.y + position.y);
  }
}
