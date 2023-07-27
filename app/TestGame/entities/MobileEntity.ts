import { Body, Vector } from "matter-js";
import { Entity } from "./Entity";
import { Holdable } from "../holdables/Holdable";
import { Attack, AttackDirections } from "./Attack";

const baseHp = 20;
const baseTurningSpeed = 0.08;
const baseHandSpeed = 5;
const baseAcceleration = 0.01;

export enum HandSide {
  LEFT,
  RIGHT,
}

export class MobileEntity extends Entity {
  targetAngle = 0;
  acceleration = {
    current: baseAcceleration,
    base: baseAcceleration,
    getSideways: () => this.acceleration.current * 0.6,
    getReverse: () => this.acceleration.current * 0.4,
  };
  turningSpeed = { current: baseTurningSpeed, base: baseTurningSpeed };
  handSpeed = { current: baseHandSpeed, base: baseHandSpeed };
  mainHand: HandSide = HandSide.RIGHT;
  equippedHoldables: { [HandSide.RIGHT]: Holdable | null; [HandSide.LEFT]: Holdable | null } = { [HandSide.RIGHT]: null, [HandSide.LEFT]: null };
  currentAttackExecuting: Attack | null = null;
  // attackOrderPreference: AttackDirections[] = [AttackDirections.LEFT, AttackDirections.RIGHT, AttackDirections.FORWARD];
  attackOrderPreference: AttackDirections[] = [AttackDirections.LEFT, AttackDirections.RIGHT, AttackDirections.FORWARD];
  currentAttackOrderIndex: number | null = null;
  weakpoint: { offset: Vector; radius: number } = { offset: { x: 0, y: 0 }, radius: 10 };
  constructor(id: number, body: Body, owner: string, acceleration: number = 0.01, turningSpeed?: number, jumpHeight?: number) {
    super(id, body, 1, 1, { max: baseHp, current: baseHp }, owner);
    this.acceleration.base = acceleration;
    if (turningSpeed) this.turningSpeed.current = this.turningSpeed.base = turningSpeed;
  }
}
