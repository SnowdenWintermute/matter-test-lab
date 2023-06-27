import { Vector } from "matter-js";
import { TestGame } from "..";
import drawCircle from "./drawCircle";
import drawAngleLine from "./drawLine";
import drawPoly from "./drawPoly";
import drawDebugText from "./drawDebugText";
import { angleBetweenPoints, getPointInArc } from "@/app/utils";
import drawGrips from "./drawGrips";
import drawHoldablePositions from "./drawHoldablePositions";
import drawGrid from "./drawGrid";
import { PointRelativeToBody } from "../holdables/PointRelativeToBody";

export default function render(context: CanvasRenderingContext2D, game: TestGame, canvasSize: { width: number; height: number }) {
  context.clearRect(0, 0, canvasSize.width, canvasSize.height);
  // drawGrid(context, canvasSize, 25);
  Object.values(game.entities.static).forEach((entity) => {
    drawPoly(context, entity.body.vertices, "grey");
  });
  Object.values(game.entities.mobile).forEach((entity) => {
    drawPoly(context, entity.body.vertices, "grey");
  });
  Object.values(game.entities.playerControlled).forEach((entity) => {
    const { position, angle } = entity.body;
    const { targetAngle } = entity;
    drawPoly(context, entity.body.vertices, "#9ba8b8");
    drawAngleLine(context, position, angle, 4, 40, "#a52026");
    drawAngleLine(context, position, targetAngle, 4, 40, "#028a7e");
    drawDebugText(context, entity);
  });
  Object.values(game.entities.holdable).forEach((holdable) => {
    drawPoly(context, holdable.body.vertices, "white");
    drawCircle(context, holdable.body.vertices[0], 2, "red", true);
    drawCircle(context, holdable.body.position, 1, "black", true);
    if (!holdable.heldBy) return;
    drawGrips(context, holdable, holdable.heldBy);
    // drawHoldablePositions(context, holdable, holdable.heldBy.body);
  });
}
