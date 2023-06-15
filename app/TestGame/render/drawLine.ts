import { Vector } from "matter-js";

export default function drawAngleLine(
  context: CanvasRenderingContext2D,
  point: Vector,
  angle: number,
  width: number,
  length: number,
  color: string
) {
  context.beginPath();
  const { x, y } = point;
  context.strokeStyle = color;
  context.lineWidth = width;
  context.moveTo(x, y);
  context.lineTo(x + length * Math.cos(angle), y + length * Math.sin(angle));
  context.stroke();
}
