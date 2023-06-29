import { EntityCategory } from "../enums";

export class Trauma {
  distanceTravelled: number = 0;
  totalDamage: number = 0;
  maxNegativeAngleChange: number = 0;
  maxPositiveAngleChange: number = 0;
  constructor(
    entityExperiencingMeta: { id: number; category: EntityCategory },
    public sourceId: number,
    public deepestPenetration: number,
    public originalSourceAngle: number
  ) {}
  // keep track of size of overlap and the change in source's angle
  // modified by the closest point on the source's polygon toward the center (or other weakpoint)
}
