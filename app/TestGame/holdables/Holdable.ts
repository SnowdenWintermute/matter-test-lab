import { Body, Vector } from "matter-js";
import { DistanceAndAngle } from "../common-classes";
import { Entity } from "../entities/Entity";
import { MobileEntity } from "../entities/MobileEntity";
import { PointRelativeToBody } from "./PointRelativeToBody";
import Matter from "matter-js";
import { distBetweenTwoPoints } from "@/app/utils";

export enum HoldableType {
  SPEAR,
}

export class HoldableGripCreationData {
  gripDistance: number;
  constructor(public gripA: Vector | DistanceAndAngle, public gripB: Vector | DistanceAndAngle, public gripOffset?: number) {
    const dummyBody = Matter.Bodies.rectangle(0, 0, 3, 3);
    const gripPointA = new PointRelativeToBody(gripA, dummyBody);
    const gripPointB = new PointRelativeToBody(gripA, dummyBody);
    this.gripDistance = distBetweenTwoPoints(gripPointA.offsetFromBody, gripPointB.offsetFromBody);
  }
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
  heldBy: MobileEntity | null = null;
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
