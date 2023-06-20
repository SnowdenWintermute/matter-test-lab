import { Vector } from "matter-js";
import { TestGame } from "..";
import drawCircle from "./drawCircle";
import drawAngleLine from "./drawLine";
import drawPoly from "./drawPoly";
import drawDebugText from "./drawDebugText";
import { getPointInArc } from "@/app/utils";

export default function render(context: CanvasRenderingContext2D, game: TestGame, canvasSize: { width: number; height: number }) {
  context.clearRect(0, 0, canvasSize.width, canvasSize.height);
  Object.values(game.entities.static).forEach((entity) => {
    drawCircle(context, entity.body.position, entity.body.circleRadius!, "grey", true);
  });
  Object.values(game.entities.playerControlled).forEach((entity) => {
    const { position, angle } = entity.body;
    const { targetAngle } = entity;
    drawPoly(context, entity.body.vertices, "#9ba8b8");
    drawAngleLine(context, position, angle, 4, 40, "#a52026");
    drawAngleLine(context, position, targetAngle, 4, 40, "#028a7e");

    const { spear } = entity;
    drawPoly(context, spear.body.vertices, "white");
    const { desiredRightHandPosition, desiredLeftHandPosition } = entity;
    context.lineWidth = 2;
    let pointToDraw = Vector.add(position, desiredRightHandPosition.pointA);
    drawCircle(context, pointToDraw, 5, "black", false);
    pointToDraw = Vector.add(position, desiredLeftHandPosition.pointA);
    drawCircle(context, pointToDraw, 5, "red", false);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("L", desiredLeftHandPosition.pointA.x + position.x, desiredLeftHandPosition.pointA.y + position.y);
    // pointToDraw = Vector.add(spear.body.position, desiredRightHandPosition.pointB);
    // drawCircle(context, pointToDraw, 5, "rgba(0,0,0,.5)", true);
    // pointToDraw = Vector.add(spear.body.position, desiredLeftHandPosition.pointB);

    // drawCircle(context, pointToDraw, 5, "rgba(255,0,0,.5)", true);
    // const lhrp = getPointInArc(position, angle + spear.leftHandRestPosition.angle, spear.leftHandRestPosition.distance);
    // const rhrp = getPointInArc(position, angle + spear.rightHandRestPosition.angle, spear.rightHandRestPosition.distance);
    // drawCircle(context, lhrp, 3, "blue", true);
    // drawCircle(context, rhrp, 3, "orange", true);
    // const lhrdp = getPointInArc(position, angle + spear.leftHandReadyPosition.angle, spear.leftHandReadyPosition.distance);
    // const rhrdp = getPointInArc(position, angle + spear.rightHandReadyPosition.angle, spear.rightHandReadyPosition.distance);
    // drawCircle(context, lhrdp, 3, "cyan", true);
    // drawCircle(context, rhrdp, 3, "yellow", true);
    // drawDebugText(context, entity);
  });
}
