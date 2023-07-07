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

export class AttackInstructions {
  constructor(
    public steps: {
      position: HoldableGripConstraintCreationData;
      damageType: DamageType;
      onReached?: () => void;
      onStart?: () => void;
    }[],
    public baseTimeout: number,
    public cooldown: number
  ) {}
}

export class Attack {
  timeStarted = +Date.now();
  nextAttack: AttackInstructions | null = null;
  currentPositionIndex: number = 0;
  constructor(public instructionSet: AttackInstructions, public damageModifier: number) {}
  // if baseTimeout modified by handSpeed is reached, go to rest position and end attack
  // if attack input is received before execution of the last position, start the next attack instead of executing the last position
  // if guard input received, finish the current attack then enter guard position
}
