import { Vector } from "matter-js";
import { HoldableGripConstraintCreationData } from "../holdables/HoldableGripConstraintCreationData";

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
  PERPENDICULAR_ARC,
}

export class ArcMovementParameters {
  constructor(public arcCenterOffsetFromBody: Vector, public arcEndingRadius: number, public arcDirection: 1 | -1) {}
}

export class AttackStep {
  constructor(
    public position: HoldableGripConstraintCreationData,
    public movementType: MovementType,
    public damageType: DamageType,
    public arcMovementParameters?: ArcMovementParameters,
    public onReached?: () => void,
    public onStart?: () => void,
    public timeout?: number
  ) {}
}

export class AttackInstructions {
  constructor(public steps: AttackStep[], public baseTimeout: number, public cooldown: number) {}
}

export class Attack {
  timeCurrentStepStarted = +Date.now();
  currentStepIndex: number = 0;
  isComplete: boolean = false;
  constructor(public instructionSet: AttackInstructions, public damageModifier: number) {}
  // if baseTimeout modified by handSpeed is reached, go to rest position and end attack
  // if attack input is received before execution of the last position, start the next attack instead of executing the last position
  // if guard input received, finish the current attack then enter guard position
}
