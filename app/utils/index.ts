import { Vector } from "matter-js";

export function roundedStringifiedVector(vec: Vector, precision = 1) {
  return `${vec.x.toFixed(precision)} ${vec.y.toFixed(precision)}`;
}

export function normalizeRadians(radians: number): number {
  const PI_2 = 2 * Math.PI;
  return radians - PI_2 * Math.floor(radians / PI_2) - Math.PI;
}

export function distBetweenTwoPoints(pointA: Vector, pointB: Vector): number {
  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function angleBetweenPoints(pointA: Vector, pointB: Vector): number {
  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;
  return Math.atan2(dx, dy);
}

export function moveNumberTowards(number: number, targetNumber: number, speed: number) {
  const difference = targetNumber - number;
  if (Math.abs(difference) <= speed) return targetNumber;
  const sign = Math.sign(difference);
  const newNumber = number + speed * sign;
  if ((targetNumber - newNumber) * sign < 0) return targetNumber;
  return newNumber;
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

export function getAngleFromCenter(center: Vector, point: Vector): number {
  const deltaX = point.x - center.x;
  const deltaY = point.y - center.y;
  return Math.atan2(deltaY, deltaX);
}

export function getNormalizedAngleDiff(angleA: number, angleB: number) {
  const normalizedAngle = normalizeRadians(angleA);
  const normalizedTarget = normalizeRadians(angleB);
  const difference = normalizedTarget - normalizedAngle;
  return difference;
}

export function getClosestAngleDifference(angle1: number, angle2: number): number {
  const fullCircle = 2 * Math.PI;
  const difference = Math.abs(angle1 - angle2);
  if (difference <= Math.PI) return difference;
  else return fullCircle - difference;
}

export function getDirectionAndDiffOfClosestPathToTargetAngle(angle: number, targetAngle: number, diffTolerance: number) {
  const difference = getNormalizedAngleDiff(angle, targetAngle);
  let direction = 0;
  if (Math.abs(difference) < diffTolerance) direction = 0;
  else if (Math.abs(difference) <= Math.PI) direction = Math.sign(difference);
  else direction = -Math.sign(difference);
  return { direction, difference };
}

export function getSpeedOfApproach(approachingBody: Matter.Body, targetBody: Matter.Body) {
  const relativeVelocity = Vector.sub(targetBody.velocity, approachingBody.velocity);
  const displacement = Vector.sub(targetBody.position, approachingBody.position);
  const displacementNormalized = Vector.normalise(displacement);
  const linearSpeedOfApproach = Vector.dot(relativeVelocity, displacementNormalized);
  const perpendicularDistance = Vector.cross(displacement, displacementNormalized);
  const rotationalSpeedOfApproach = approachingBody.angularVelocity * perpendicularDistance;
  const totalSpeedOfApproach = linearSpeedOfApproach + rotationalSpeedOfApproach;
  return totalSpeedOfApproach;
}

export function bucketAngle(angle: number, numSections: number): number {
  angle = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  const sectionSize = (2 * Math.PI) / numSections;
  const sectionIndex = Math.floor(angle / sectionSize);
  return sectionIndex;
}
