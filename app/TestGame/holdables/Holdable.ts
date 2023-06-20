import { Body } from "matter-js";
import { PointRelativeToBody } from "./PointRelativeToBody";

export enum HoldableType {
  SPEAR,
}

export class HoldablePosition {
  leftHand?: {
    upperGripPoint: PointRelativeToBody;
    lowerGripPoint: PointRelativeToBody;
  };
  rightHand?: {
    upperGripPoint: PointRelativeToBody;
    lowerGripPoint: PointRelativeToBody;
  };
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
