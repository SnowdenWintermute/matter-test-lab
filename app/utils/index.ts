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

export function angleBetweenPoints(pointA: Vector, pointB: Vector): number {
  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;

  return Math.atan2(dy, dx);
}

export function movePointTowards(point: Vector, targetPoint: Vector, distance: number): Vector {
  const dx = targetPoint.x - point.x;
  const dy = targetPoint.y - point.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const ratio = distance / length;
  const newX = point.x + dx * ratio;
  const newY = point.y + dy * ratio;

  return { x: newX, y: newY };
}
export function movePointAway(point: Vector, targetPoint: Vector, distance: number) {
  return movePointTowards(point, targetPoint, distance * -1);
}

export function getPointInArc(center: Vector, angle: number, radius: number): Vector {
  const x = center.x + Math.cos(angle) * radius;
  const y = center.y + Math.sin(angle) * radius;
  return { x, y };
}

export function getDirectionOfClosestPathToTargetAngle(angle: number, targetAngle: number, diffTolerance: number) {
  const normalizedAngle = normalizeRadians(angle);
  const normalizedTarget = normalizeRadians(targetAngle);
  const difference = normalizedTarget - normalizedAngle;
  let dir = 0;
  if (Math.abs(difference) < diffTolerance) dir = 0;
  else if (Math.abs(difference) <= Math.PI) dir = Math.sign(difference);
  else dir = -Math.sign(difference);
  return dir;
}