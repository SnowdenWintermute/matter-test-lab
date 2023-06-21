import { Body, Vector } from "matter-js";
import { DistanceAndAngle } from "../common-classes";
import { Entity } from "../entities/Entity";

export enum HoldableType {
  SPEAR,
}

export class HoldableGripCreationData {
  constructor(public gripA: Vector | DistanceAndAngle, public gripB: Vector | DistanceAndAngle, public gripOffset?: number) {}
}

export type HoldablePositionOptions = {
  rest?: HoldableGripCreationData;
  ready?: HoldableGripCreationData;
  forwardStrike?: HoldableGripCreationData;
  leftStrike?: HoldableGripCreationData;
  rightStrike?: HoldableGripCreationData;
  leftGuard?: HoldableGripCreationData;
  rightGuard?: HoldableGripCreationData;
  centerGuard?: HoldableGripCreationData;
};

export abstract class Holdable extends Entity {
  constructor(
    id: number,
    body: Body,
    public type: HoldableType,
    public requiresTwoHands: boolean,
    public positionOptions: HoldablePositionOptions,
    public grips: {
      a: Matter.Constraint | null;
      b: Matter.Constraint | null;
    } = { a: null, b: null }
  ) {
    super(id, body, 1, 0, { max: 10, current: 10 });
  }
}
