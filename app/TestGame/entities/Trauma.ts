import { EntityCategory } from "../enums";

export const numberOfAngleBuckets = 100;

export class Trauma {
  totalDamage: number = 0;
  currentOverlap: number = 0;
  currentDistToCenter: number = 0;
  overlapsBucketedByAngleDiffs: { [bucket: number]: number } = {};
  constructor(entityExperiencingMeta: { id: number; category: EntityCategory }, public sourceId: number) {}
}
