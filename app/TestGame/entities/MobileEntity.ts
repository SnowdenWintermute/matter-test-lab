import { Body } from "matter-js";
import { Entity } from "./Entity";
import { Holdable } from "../holdables/Holdable";
import { CombatMoveExecutionState, EntityStance } from "../enums";

export class MobileEntity extends Entity {
  targetAngle = 0;
  acceleration = 0.001;
  reverseAccelerationModifier = 0.4;
  sidewaysAccelerationModifier = 0.6;
  topSpeed: number = 10;
  turningSpeed = 0.08;
  jumpHeight = 20;
  jumpStrength = 1;
  handSpeed = 8;
  jumping = false;
  mainHand: "Left" | "Right" = "Right";
  equippedHoldables: { rightHand: Holdable | null; leftHand: Holdable | null } = { rightHand: null, leftHand: null };
  stance = EntityStance.AT_EASE;
  combatMoveExecutionState = CombatMoveExecutionState.AT_REST;
  constructor(id: number, body: Body, owner: string, acceleration: number = 0.01, topSpeed: number = 10, turningSpeed?: number, jumpHeight?: number) {
    super(id, body, 1, 1, { max: 10, current: 10 }, owner);
    this.acceleration = acceleration;
    this.topSpeed = topSpeed;
    if (turningSpeed) this.turningSpeed = turningSpeed;
    if (jumpHeight) this.jumpHeight = jumpHeight;
  }
}
