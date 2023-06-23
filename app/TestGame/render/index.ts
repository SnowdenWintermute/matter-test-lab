import { Vector } from "matter-js";
import { TestGame } from "..";
import drawCircle from "./drawCircle";
import drawAngleLine from "./drawLine";
import drawPoly from "./drawPoly";
import drawDebugText from "./drawDebugText";
import { getPointInArc } from "@/app/utils";
import drawGrips from "./drawGrips";
import drawHoldablePositions from "./drawHoldablePositions";

export default function render(context: CanvasRenderingContext2D, game: TestGame, canvasSize: { width: number; height: number }) {
  context.clearRect(0, 0, canvasSize.width, canvasSize.height);
  Object.values(game.entities.static).forEach((entity) => {
    drawCircle(context, entity.body.position, entity.body.circleRadius!, "grey", true);
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

    const spear = entity.equippedHoldables.rightHand;
    if (spear) {
      drawGrips(context, spear, entity);
      drawHoldablePositions(context, spear, entity.body);
    }
    drawDebugText(context, entity);
  });
}
