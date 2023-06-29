import { Body, Vector } from "matter-js";
import { Entity } from "../entities/Entity";
import { MobileEntity } from "../entities/MobileEntity";
import Matter from "matter-js";
import { getPointInArc } from "@/app/utils";
import slideGrip from "./slideGrip";

export enum HoldableType {
  SPEAR,
}

export type HoldableGripPairOffsets = {
  upper: Vector;
  lower: Vector;
};

export class HoldableGripConstraintCreationData {
  main: HoldableGripPairOffsets;
  support?: HoldableGripPairOffsets;
  constructor(
    public lowestGripPoint: Vector,
    public angle: number,
    public distBetweenPairMembers: number,
    public distBetweenGripPairs?: number,
    public lowestPointYOffsetFromHoldableBottom?: number,
    public stiffnesses = { main: { lower: 1, upper: 0.8 }, support: { lower: 0.7, upper: 0.5 } }
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
  rest?: HoldableGripConstraintCreationData;
  ready?: HoldableGripConstraintCreationData;
  forwardStrike?: HoldableGripConstraintCreationData;
  leftStrike?: HoldableGripConstraintCreationData;
  rightStrike?: HoldableGripConstraintCreationData;
  leftGuard?: HoldableGripConstraintCreationData;
  rightGuard?: HoldableGripConstraintCreationData;
  centerGuard?: HoldableGripConstraintCreationData;
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
  isColliding = false;
  constructor(id: number, body: Body, public type: HoldableType, public requiresTwoHands: boolean, public length: number) {
    super(id, body, 1, 0, { max: 10, current: 10 });
  }
  slideGrip = () => slideGrip(this);
  //getFarthestTopVertex() {
  //  //
  //}
}
