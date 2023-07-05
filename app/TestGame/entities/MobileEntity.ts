import { Body, Vector } from "matter-js";
import { Entity } from "./Entity";
import { Holdable } from "../holdables/Holdable";
import { CombatMoveExecutionState, EntityStance } from "../enums";

const baseHp = 10;

export class MobileEntity extends Entity {
  targetAngle = 0;
  acceleration = {
    current: 0.01,
    base: 0.01,
    getSideways: () => this.acceleration.current * 0.6,
    getReverse: () => this.acceleration.current * 0.4,
  };
  topSpeed: number = 10;
  turningSpeed = { current: 0.08, base: 0.08 };
  jumpHeight = 20;
  jumpStrength = 1;
  handSpeed = { current: 8, base: 8 };
  jumping = false;
  mainHand: "Left" | "Right" = "Right";
  equippedHoldables: { rightHand: Holdable | null; leftHand: Holdable | null } = { rightHand: null, leftHand: null };
  stance = EntityStance.AT_EASE;
  combatMoveExecutionState = CombatMoveExecutionState.AT_REST;
  weakpoint: { offset: Vector; radius: number } = { offset: { x: 0, y: 0 }, radius: 10 };
  constructor(id: number, body: Body, owner: string, acceleration: number = 0.01, topSpeed: number = 10, turningSpeed?: number, jumpHeight?: number) {
    super(id, body, 1, 1, { max: baseHp, current: baseHp }, owner);
    this.acceleration.base = acceleration;
    this.topSpeed = topSpeed;
    if (turningSpeed) this.turningSpeed.current = this.turningSpeed.base = turningSpeed;
    if (jumpHeight) this.jumpHeight = jumpHeight;
  }
}
