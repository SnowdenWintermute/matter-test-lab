import { Vector } from "matter-js";
import { TestGame } from "..";
import drawCircle from "./drawCircle";
import drawAngleLine from "./drawLine";
import drawPoly from "./drawPoly";

export default function render(
  context: CanvasRenderingContext2D,
  game: TestGame,
  canvasSize: { width: number; height: number }
) {
  context.clearRect(0, 0, canvasSize.width, canvasSize.height);
  Object.values(game.entities.playerControlled).forEach((entity) => {
    const { position, angle } = entity.body;
    const { targetAngle } = entity;
    drawPoly(context, entity.body.vertices, "#9ba8b8");
    drawAngleLine(context, position, angle, 4, 40, "#a52026");
    drawAngleLine(context, position, targetAngle, 4, 40, "#028a7e");

    const { spear } = entity;
    drawPoly(context, spear.vertices, "white");
    const { desiredRightHandPosition, desiredLeftHandPosition } = entity;
    context.lineWidth = 2;
    let pointToDraw = Vector.add(position, desiredRightHandPosition.pointA);
    drawCircle(context, pointToDraw, 5, "black", false);
    pointToDraw = Vector.add(position, desiredLeftHandPosition.pointA);
    drawCircle(context, pointToDraw, 5, "red", false);
    pointToDraw = Vector.add(spear.position, desiredRightHandPosition.pointB);
    drawCircle(context, pointToDraw, 5, "black", false);
    pointToDraw = Vector.add(spear.position, desiredLeftHandPosition.pointB);
    drawCircle(context, pointToDraw, 5, "red", false);
  });
}
