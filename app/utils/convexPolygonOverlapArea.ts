// Chat-GPT generated
import { Vector } from "matter-js";

function isLeft(a: Vector, b: Vector, p: Vector): boolean {
  return (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x) < 0;
}

function getIntersection(a: Vector, b: Vector, c: Vector, d: Vector): Vector {
  const ua = ((d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x)) / ((d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y));
  return {
    x: a.x + ua * (b.x - a.x),
    y: a.y + ua * (b.y - a.y),
  };
}

export default function convexPolygonOverlapArea(vertices1: Vector[], vertices2: Vector[]): number {
  const clippedVertices = [...vertices1];

  for (let i = 0; i < vertices2.length; i++) {
    const edgeStart = vertices2[i];
    const edgeEnd = vertices2[(i + 1) % vertices2.length];

    const inputVertices = [...clippedVertices];
    clippedVertices.length = 0;

    let prev = inputVertices[inputVertices.length - 1];
    for (const current of inputVertices) {
      if (!isLeft(edgeStart, edgeEnd, current)) {
        if (isLeft(edgeStart, edgeEnd, prev)) clippedVertices.push(getIntersection(prev, current, edgeStart, edgeEnd));
        clippedVertices.push(current);
      } else if (!isLeft(edgeStart, edgeEnd, prev)) clippedVertices.push(getIntersection(prev, current, edgeStart, edgeEnd));

      prev = current;
    }
  }

  let area = 0;
  const n = clippedVertices.length;
  for (let i = 0; i < n; i++) {
    const current = clippedVertices[i];
    const next = clippedVertices[(i + 1) % n];
    area += current.x * next.y - next.x * current.y;
  }

  return Math.abs(area / 2);
}
