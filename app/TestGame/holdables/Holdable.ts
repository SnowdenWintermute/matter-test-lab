import { Body, Vector } from "matter-js";
import { Entity } from "../entities/Entity";
import { MobileEntity } from "../entities/MobileEntity";
import Matter from "matter-js";
import { getPointInArc } from "@/app/utils";

export enum HoldableType {
  SPEAR,
}

export type HoldableGripPairOffsets = {
  upper: Vector;
  lower: Vector;
};

export class HoldableGripConstraintBodyOffsets {
  main: HoldableGripPairOffsets;
  support?: HoldableGripPairOffsets;
  constructor(
    public lowestGripPoint: Vector,
    public angle: number,
    public distBetweenPairMembers: number,
    public distBetweenGripPairs?: number,
    public lowestPointYOffsetFromHoldableBottom?: number
  ) {
    this.main = {
      lower: lowestGripPoint,
      upper: getPointInArc(lowestGripPoint, angle, -distBetweenPairMembers),
    };
    if (distBetweenGripPairs)
      this.support = {
        lower: getPointInArc(lowestGripPoint, angle, -distBetweenGripPairs - distBetweenPairMembers),
        upper: getPointInArc(lowestGripPoint, angle, -distBetweenGripPairs - distBetweenPairMembers * 2),
      };
  }
}

export type HoldablePositionOptions = {
  rest?: HoldableGripConstraintBodyOffsets;
  ready?: HoldableGripConstraintBodyOffsets;
  forwardStrike?: HoldableGripConstraintBodyOffsets;
  leftStrike?: HoldableGripConstraintBodyOffsets;
  rightStrike?: HoldableGripConstraintBodyOffsets;
  leftGuard?: HoldableGripConstraintBodyOffsets;
  rightGuard?: HoldableGripConstraintBodyOffsets;
  centerGuard?: HoldableGripConstraintBodyOffsets;
};

export abstract class Holdable extends Entity {
  heldBy: MobileEntity | null = null;
  grips: {
    main: {
      upper: Matter.Constraint;
      lower: Matter.Constraint;
    };
    support?: {
      upper: Matter.Constraint;
      lower: Matter.Constraint;
    };
  } | null = null;
  positionOptions: HoldablePositionOptions = {};
  constructor(id: number, body: Body, public type: HoldableType, public requiresTwoHands: boolean, public length: number) {
    super(id, body, 1, 0, { max: 10, current: 10 });
  }
}
