import { Vector } from "matter-js";
import { distBetweenTwoPoints } from ".";

// Chat-GPT generated

function getClosestPointOnSegment(start: Vector, end: Vector, point: Vector): Vector {
  const segment = { start, end };
  const closestPoint = { x: 0, y: 0 };

  const dx = segment.end.x - segment.start.x;
  const dy = segment.end.y - segment.start.y;
  const t = ((point.x - segment.start.x) * dx + (point.y - segment.start.y) * dy) / (dx * dx + dy * dy);

  if (t <= 0) {
    closestPoint.x = segment.start.x;
    closestPoint.y = segment.start.y;
  } else if (t >= 1) {
    closestPoint.x = segment.end.x;
    closestPoint.y = segment.end.y;
  } else {
    closestPoint.x = segment.start.x + t * dx;
    closestPoint.y = segment.start.y + t * dy;
  }

  return closestPoint;
}

export default function closestDistanceToPolygon(polygon: Vector[], point: Vector): number {
  let minDistance = Number.POSITIVE_INFINITY;

  for (let i = 0; i < polygon.length; i++) {
    const edgeStart = polygon[i];
    const edgeEnd = polygon[(i + 1) % polygon.length];

    const distance = distBetweenTwoPoints(point, getClosestPointOnSegment(edgeStart, edgeEnd, point));
    minDistance = Math.min(minDistance, distance);
  }

  return minDistance;
}
