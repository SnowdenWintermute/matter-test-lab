import { Vector } from "matter-js";
import { HoldableGripConstraintCreationData } from "../holdables/Holdable";

export enum AttackDirections {
  LEFT,
  RIGHT,
  FORWARD,
}

export enum DamageType {
  SLASHING,
  PIERCING,
  BLUNT,
  NONE,
}

export enum MovementType {
  LINEAR,
  ARC,
}

export type AttackStep = {
  position: HoldableGripConstraintCreationData;
  movementType: MovementType;
  damageType: DamageType;
  arcCenterOffsetFromBody?: Vector;
  arcEndingRadius?: number;
  onReached?: () => void;
  onStart?: () => void;
  timeout?: number;
};

export class AttackInstructions {
  constructor(public steps: AttackStep[], public baseTimeout: number, public cooldown: number) {}
}

export class Attack {
  timeCurrentStepStarted = +Date.now();
  nextAttack: AttackInstructions | null = null;
  currentStepIndex: number = 0;
  constructor(public instructionSet: AttackInstructions, public damageModifier: number) {}
  // if baseTimeout modified by handSpeed is reached, go to rest position and end attack
  // if attack input is received before execution of the last position, start the next attack instead of executing the last position
  // if guard input received, finish the current attack then enter guard position
}
