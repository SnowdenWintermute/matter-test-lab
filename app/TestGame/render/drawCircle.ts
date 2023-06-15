import { Vector } from "matter-js";

export default function drawCircle(
  context: CanvasRenderingContext2D,
  center: Vector,
  radius: number,
  color: string,
  fill: boolean
) {
  const { x, y } = center;
  context.beginPath();
  context.strokeStyle = context.fillStyle = color;
  context.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
  !fill ? context.stroke() : context.fill();
}
