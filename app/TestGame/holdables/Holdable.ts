import { Body, Vector } from "matter-js";
import { DistanceAndAngle } from "../common-classes";

export enum HoldableType {
  SPEAR,
}

export class HoldablePosition {
  constructor(public mainHand?: Vector | DistanceAndAngle, public offHand?: Vector | DistanceAndAngle) {}
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

export abstract class Holdable {
  constructor(public id: number, public type: HoldableType, public body: Body, public positionOptions: HoldablePositionOptions) {}
}
