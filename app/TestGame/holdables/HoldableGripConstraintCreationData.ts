import { getPointInArc } from "@/app/utils";
import { Vector } from "matter-js";

export type HoldableGripPairOffsets = {
  upper: Vector;
  lower: Vector;
};

export class HoldableGripConstraintCreationData {
  main: HoldableGripPairOffsets | null;
  support?: HoldableGripPairOffsets | null;
  constructor(
    public lowestGripPoint: Vector | null,
    public angle: number,
    public distBetweenPairMembers: number,
    public distBetweenGripPairs: number | null = null,
    public lowestPointYOffsetFromHoldableBottom?: number,
    public stiffnesses = { main: { lower: 1, upper: 0.8 }, support: { lower: 0.7, upper: 0.5 } }
  ) {
    if (!lowestGripPoint) this.main = this.support = null;
    else {
      this.main = {
        lower: lowestGripPoint,
        upper: getPointInArc(lowestGripPoint, angle, distBetweenPairMembers),
      };
      if (typeof distBetweenGripPairs === "number")
        this.support = {
          lower: getPointInArc(lowestGripPoint, angle, distBetweenGripPairs + distBetweenPairMembers),
          upper: getPointInArc(lowestGripPoint, angle, distBetweenGripPairs + distBetweenPairMembers * 2),
        };
    }
  }
}
