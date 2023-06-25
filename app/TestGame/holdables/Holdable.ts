import { Body, Vector } from "matter-js";
import { DistanceAndAngle } from "../common-classes";
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
  constructor(lowestGripPoint: Vector, angle: number, handHeight: number, distanceBetweenGripPairs?: number) {
    this.main = {
      upper: getPointInArc(lowestGripPoint, angle, handHeight),
      lower: lowestGripPoint,
    };
    if (distanceBetweenGripPairs)
      this.support = {
        upper: getPointInArc(lowestGripPoint, angle, handHeight * 2 + distanceBetweenGripPairs),
        lower: getPointInArc(lowestGripPoint, angle, handHeight + distanceBetweenGripPairs),
      };
  }
}

export class HoldableGripCreationData {
  constructor(
    public gripA: Vector | DistanceAndAngle,
    public gripB: Vector | DistanceAndAngle,
    public gripC: Vector | DistanceAndAngle,
    public gripOffset?: number
  ) {}
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
  constructor(
    id: number,
    body: Body,
    public type: HoldableType,
    public requiresTwoHands: boolean,
    public positionOptions: HoldablePositionOptions,
    public grips: {
      mainHand: {
        upper: Matter.Constraint;
        lower: Matter.Constraint;
      };
      offHand?: {
        upper: Matter.Constraint;
        lower: Matter.Constraint;
      };
    } | null = null
  ) {
    super(id, body, 1, 0, { max: 10, current: 10 });
  }
}
