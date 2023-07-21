import { TestGame } from "..";
import drawCircle from "./drawCircle";
import drawAngleLine from "./drawLine";
import drawPoly from "./drawPoly";
import drawGrips from "./drawGrips";
import drawHoldablePositions from "./drawHoldablePositions";
import drawHP from "./drawHP";
import drawEntityDebugText from "./drawEntityDebugText";
import { WidthAndHeight } from "../common-classes";
import drawDebugText from "./drawDebugText";
import { Vector } from "matter-js";
import { angleBetweenPoints, distBetweenTwoPoints, getPointInArc } from "@/app/utils";

export default function render(context: CanvasRenderingContext2D, game: TestGame, canvasSize: WidthAndHeight) {
  context.clearRect(0, 0, canvasSize.width, canvasSize.height);
  // drawGrid(context, canvasSize, 25);
  Object.values(game.entities.static).forEach((entity) => {
    drawPoly(context, entity.body.vertices, "grey");
    drawCircle(context, entity.body.position, 3, "blue", true);
  });
  Object.values(game.entities.mobile).forEach((entity) => {
    drawPoly(context, entity.body.vertices, "grey");
  });
  Object.values(game.entities.playerControlled).forEach((entity) => {
    const { position, angle } = entity.body;
    const { targetAngle, weakpoint } = entity;
    drawPoly(context, entity.body.vertices, "#9ba8b8");
    drawAngleLine(context, position, angle, 4, 40, "#a52026");
    drawAngleLine(context, position, targetAngle, 4, 40, "#028a7e");
    drawEntityDebugText(context, entity);
    drawHP(context, entity);
    const weakpointNonRotatedPosition = Vector.add(position, weakpoint.offset);
    drawCircle(
      context,
      getPointInArc(position, angleBetweenPoints(position, weakpointNonRotatedPosition), distBetweenTwoPoints(position, weakpointNonRotatedPosition)),
      weakpoint.radius,
      "grey",
      true
    );
  });

  Object.values(game.entities.holdable).forEach((holdable) => {
    const { body } = holdable;
    const { x, y } = body.position;
    // drawPoly(context, holdable.body.vertices, holdable.isColliding ? "black" : "white");
    // context.fillStyle = "black";
    // context.fillRect(x - 1, y - 1, 3, 3);
    // drawCircle(context, holdable.body.vertices[0], 2, "red", true);
    // drawCircle(context, holdable.body.position, 1, "black", true);
    if (!holdable.heldBy) return;
    // drawGrips(context, holdable, holdable.heldBy);
    // drawHoldablePositions(context, holdable, holdable.heldBy.body);
  });
  drawDebugText(context, canvasSize, game);
}
