import Matter, { Body, Vector } from "matter-js";
import cloneDeep from "lodash.clonedeep";
import { angleBetweenPoints, distBetweenTwoPoints, getPointInArc } from "../../utils";
import { Entity } from "./Entity";
import { Holdable } from "../holdables/Holdable";
import { DistanceAndAngle } from "../common-classes";
import { PointRelativeToBody } from "../holdables/PointRelativeToBody";
import { Spear } from "../holdables/Spear";

export enum EntityStance {
  AT_EASE,
  COMBAT_READY,
}

export enum CombatMoveExecutionState {
  AT_REST,
  READYING,
  EXECUTING,
  RETURNING_TO_READY,
  RETURNING_TO_REST,
}

function createGripPosition(body: Body, holdable: Holdable, gripPositionBodyOffset: Vector, holdableOffset?: number) {
  return Matter.Constraint.create({
    bodyA: body,
    bodyB: holdable.body,
    pointA: gripPositionBodyOffset,
    pointB: { x: 0, y: holdableOffset || 0 },
    stiffness: 1,
    length: 0,
  });
}

export class MobileEntity extends Entity {
  targetAngle = 0;
  acceleration = 1;
  reverseAccelerationModifier = 0.4;
  sidewaysAccelerationModifier = 0.6;
  topSpeed: number = 10;
  turningSpeed = 0.12;
  jumpHeight = 20;
  jumpStrength = 1;
  handSpeed = 2;
  jumping = false;
  mainHand: "Left" | "Right" = "Right";
  equippedHoldables: { rightHand: Holdable | null; leftHand: Holdable | null } = { rightHand: null, leftHand: null };
  stance = EntityStance.AT_EASE;
  combatMoveExecutionState = CombatMoveExecutionState.AT_REST;
  constructor(id: number, body: Body, owner: string, acceleration: number, topSpeed: number, turningSpeed?: number, jumpHeight?: number) {
    super(id, body, 1, 1, { max: 10, current: 10 }, owner);
    this.acceleration = acceleration;
    this.topSpeed = topSpeed;
    if (turningSpeed) this.turningSpeed = turningSpeed;
    if (jumpHeight) this.jumpHeight = jumpHeight;
    const spear = new Spear(this.body.position);
    this.equipHoldable(spear);
  }

  equipHoldable(holdable: Holdable) {
    if (holdable.requiresTwoHands) {
      this.equippedHoldables.rightHand = holdable;
      this.equippedHoldables.leftHand = holdable;
    } else if (this.mainHand === "Left") this.equippedHoldables.leftHand = holdable;
    else this.equippedHoldables.rightHand = holdable;

    if (holdable.positionOptions.rest?.gripACreationData) {
      const bodyGripPointPositionA = new PointRelativeToBody(holdable.positionOptions.rest.gripACreationData, this.body);
      const bodyGripPointPositionB = new PointRelativeToBody(holdable.positionOptions.rest.gripBCreationData, this.body);
      const gripDistance = distBetweenTwoPoints(bodyGripPointPositionA.offsetFromBody, bodyGripPointPositionB.offsetFromBody);
      holdable.gripPositionA = createGripPosition(
        this.body,
        holdable,
        bodyGripPointPositionA.offsetFromBody,
        gripDistance / 2 - (holdable.positionOptions.rest.gripOffset || 0)
      );
      holdable.gripPositionB = createGripPosition(
        this.body,
        holdable,
        bodyGripPointPositionB.offsetFromBody,
        gripDistance / 2 + (holdable.positionOptions.rest.gripOffset || 0)
      );
    }
  }
}
