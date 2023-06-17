import { Vector } from "matter-js";

export function normalizeRadians(radians: number): number {
  while (radians <= -Math.PI) radians += 2 * Math.PI;
  while (radians > Math.PI) radians -= 2 * Math.PI;
  return radians;
}

export function distBetweenTwoPoints(pointA: Vector, pointB: Vector): number {
  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function movePointTowards(
  point: Vector,
  targetPoint: Vector,
  distance: number
): Vector {
  const dx = targetPoint.x - point.x;
  const dy = targetPoint.y - point.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  const ratio = distance / length;
  const newX = point.x + dx * ratio;
  const newY = point.y + dy * ratio;

  return { x: newX, y: newY };
}
