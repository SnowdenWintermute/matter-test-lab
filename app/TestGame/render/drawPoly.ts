import { Vector } from "matter-js";

export default function drawPoly(
  context: CanvasRenderingContext2D,
  vertices: Vector[],
  color: string
) {
  context.fillStyle = color;
  context.beginPath();
  vertices.forEach((vertex, i) => {
    if (i === 0) context.moveTo(vertex.x, vertex.y);
    else context.lineTo(vertex.x, vertex.y);
  });
  context.closePath();
  context.fill();
}
