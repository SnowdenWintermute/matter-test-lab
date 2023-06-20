import Matter, { Vector } from "matter-js";
import cloneDeep from "lodash.clonedeep";
import { angleBetweenPoints, distBetweenTwoPoints, getPointInArc } from "../../utils";
import { Entity } from "./Entity";
import { GripPoint } from "./GripPoint";
import { Holdable } from "../holdables/Holdable";

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

export class HandPosition {
  constructor(public upperGripPoint?: Matter.Constraint, public lowerGripPoint?: Matter.Constraint, public holding?: Holdable) {}
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
  equippedHoldables: { [id: number]: Holdable };
  leftHand: HandPosition;
  rightHand: HandPosition;
  stance = EntityStance.AT_EASE;
  combatMoveExecutionState = CombatMoveExecutionState.AT_REST;
  constructor(
    engine: Matter.Engine,
    id: number,
    owner: string,
    acceleration: number,
    topSpeed: number,
    position: { x: number; y: number },
    turningSpeed?: number,
    jumpHeight?: number
  ) {
    const body = Matter.Bodies.polygon(position.x, position.y, 8, 40);
    body.frictionAir = 0.3;
    body.mass = 500;
    const startingAngle = -Math.PI / 2;
    Matter.Body.setAngle(body, startingAngle);
    super(id, body, 1, 1, owner, { max: 10, current: 10 });
    //
    Matter.Composite.add(engine.world, body);
    this.acceleration = acceleration;
    this.topSpeed = topSpeed;
    if (turningSpeed) this.turningSpeed = turningSpeed;
    if (jumpHeight) this.jumpHeight = jumpHeight;
  }
}
