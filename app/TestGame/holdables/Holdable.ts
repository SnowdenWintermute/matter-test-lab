import { Body, Vector } from "matter-js";
import { DistanceAndAngle } from "../common-classes";
import { Entity } from "../entities/Entity";

export enum HoldableType {
  SPEAR,
}

export class HoldablePosition {
  constructor(public gripACreationData: Vector | DistanceAndAngle, public gripBCreationData: Vector | DistanceAndAngle, public gripOffset?: number) {}
}

export type HoldablePositionOptions = {
  rest?: HoldablePosition;
  ready?: HoldablePosition;
  forwardStrike?: HoldablePosition;
  leftStrike?: HoldablePosition;
  rightStrike?: HoldablePosition;
  leftGuard?: HoldablePosition;
  rightGuard?: HoldablePosition;
  centerGuard?: HoldablePosition;
};

export abstract class Holdable extends Entity {
  constructor(
    id: number,
    body: Body,
    public type: HoldableType,
    public requiresTwoHands: boolean,
    public positionOptions: HoldablePositionOptions,
    public gripPositionA: Matter.Constraint | null = null,
    public gripPositionB: Matter.Constraint | null = null
  ) {
    super(id, body, 1, 0, { max: 10, current: 10 });
  }
}
