import { Vector } from "matter-js";
import { getPointInArc } from "../../utils";
import { Holdable } from "../holdables/Holdable";
import { PointRelativeToBody } from "../holdables/PointRelativeToBody";
import drawCircle from "./drawCircle";

export default function drawHoldablePositions(context: CanvasRenderingContext2D, holdable: Holdable, body: Matter.Body) {
  const { attacks } = holdable;
  const firstOption = attacks.light![0]!;
  const { steps } = firstOption;
  const { position } = steps[0];
  // drawCircle(context, Vector.rotateAbout(Vector.add(position.main.lower, body.position), body.angle, body.position), 4, "orange", false);
  // drawCircle(context, Vector.rotateAbout(Vector.add(position.main.upper, body.position), body.angle, body.position), 4, "orange", false);
  // drawCircle(context, Vector.rotateAbout(Vector.add(position.support!.lower, body.position), body.angle, body.position), 4, "orange", false);
  // drawCircle(context, Vector.rotateAbout(Vector.add(position.support!.upper, body.position), body.angle, body.position), 4, "orange", false);
}
