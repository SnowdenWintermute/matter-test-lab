export function normalizeRadians(radians: number): number {
  while (radians <= -Math.PI) radians += 2 * Math.PI;
  while (radians > Math.PI) radians -= 2 * Math.PI;
  return radians;
}
