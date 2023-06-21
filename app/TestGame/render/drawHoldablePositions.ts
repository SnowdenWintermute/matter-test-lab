import { getPointInArc } from "../../utils";
import { Holdable } from "../holdables/Holdable";
import { PointRelativeToBody } from "../holdables/PointRelativeToBody";
import drawCircle from "./drawCircle";

export default function drawHoldablePositions(context: CanvasRenderingContext2D, holdable: Holdable, body: Matter.Body) {
  const { position, angle } = body;
  const { positionOptions } = holdable;
  if (positionOptions.rest) {
    const relativeRestPositionA = new PointRelativeToBody(positionOptions.rest.gripA, body);
    const relativeRestPositionB = new PointRelativeToBody(positionOptions.rest.gripB, body);
    const gripARestPosition = getPointInArc(position, angle + relativeRestPositionA.angleFromBody, relativeRestPositionA.distanceFromBody);
    const gripBRestPosition = getPointInArc(position, angle + relativeRestPositionB.angleFromBody, relativeRestPositionB.distanceFromBody);
    context.fillStyle = "orange";
    context.fillText("A", gripARestPosition.x, gripARestPosition.y);
    context.fillStyle = "blue";
    context.fillText("B", gripBRestPosition.x, gripBRestPosition.y);
    // drawCircle(context, gripARestPosition, 3, "orange", true);
    // drawCircle(context, gripBRestPosition, 3, "blue", true);
  }
  if (positionOptions.ready) {
    const relativeReadyPositionA = new PointRelativeToBody(positionOptions.ready.gripA, body);
    const relativeReadyPositionB = new PointRelativeToBody(positionOptions.ready.gripB, body);
    const gripAReadyPosition = getPointInArc(position, angle + relativeReadyPositionA.angleFromBody, relativeReadyPositionA.distanceFromBody);
    const gripBReadyPosition = getPointInArc(position, angle + relativeReadyPositionB.angleFromBody, relativeReadyPositionB.distanceFromBody);
    context.fillStyle = "yellow";
    context.fillText("A", gripAReadyPosition.x, gripAReadyPosition.y);
    context.fillStyle = "cyan";
    context.fillText("B", gripBReadyPosition.x, gripBReadyPosition.y);
    // drawCircle(context, gripAReadyPosition, 3, "yellow", true);
    // drawCircle(context, gripBReadyPosition, 3, "cyan", true);
  }
}
