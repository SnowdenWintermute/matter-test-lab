import { EntityCategory } from "../enums";

export class Trauma {
  totalDamage: number = 0;
  constructor(
    entityExperiencingMeta: { id: number; category: EntityCategory },
    public sourceId: number,
    public currentDistToCenter: number,
    public currentAngleDiffSourceToEntity: number,
    public currentOverlap: number
  ) {}
  // on each tick multiply the angle change since last step by the current overlap by the current distance toward center to get damage for that tick
}
