import { Constraint, Vector } from "matter-js";
import { Holdable } from "../holdables/Holdable";
import drawCircle from "./drawCircle";
import { MobileEntity } from "../entities/MobileEntity";

function drawGrip(
  context: CanvasRenderingContext2D,
  holdable: Holdable,
  entity: MobileEntity,
  grip: Constraint,
  color: string = "0,0,0",
  label?: string,
  showBodyGripPosition: boolean = true
) {
  const { position } = entity.body;
  const { pointA, pointB } = grip;
  const holdableGripWorldPosition = Vector.add(holdable.body.position, pointB);
  drawCircle(context, holdableGripWorldPosition, 5, `rgba(${color},.7)`, true);
  if (showBodyGripPosition) {
    const bodyGripWorldPosition = Vector.add(position, pointA);
    drawCircle(context, bodyGripWorldPosition, 5, `rgba(${color},1)`, false);
    // context.textAlign = "center";
    // context.textBaseline = "middle";
    // if (label) context.fillText(label, pointA.x + position.x, pointA.y + position.y);
  }
}
export default function drawGrips(context: CanvasRenderingContext2D, holdable: Holdable, entity: MobileEntity) {
  const { grips } = holdable;
  if (!grips) return;
  const { main, support } = grips;
  context.lineWidth = 2;
  const showBodyGripPositions = true;
  if (main.lower) drawGrip(context, holdable, entity, main.lower, "0,0,0", "ML", showBodyGripPositions);
  if (main.upper) drawGrip(context, holdable, entity, main.upper, "255,0,0", "MU", showBodyGripPositions);
  if (support?.lower) drawGrip(context, holdable, entity, support.lower, "0,255,0", "SL", showBodyGripPositions);
  if (support?.upper) drawGrip(context, holdable, entity, support.upper, "0,0,255", "SU", showBodyGripPositions);
}
