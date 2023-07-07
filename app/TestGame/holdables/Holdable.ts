import { Body, Vector } from "matter-js";
import { Entity } from "../entities/Entity";
import { MobileEntity } from "../entities/MobileEntity";
import Matter from "matter-js";
import { getPointInArc } from "@/app/utils";
import slideGrip from "./slideGrip";

export enum HoldableType {
  SPEAR,
  ONE_HANDED_SWORD,
}

export type HoldableGripPairOffsets = {
  upper: Vector;
  lower: Vector;
};

export class HoldableGripConstraintCreationData {
  main: HoldableGripPairOffsets;
  support?: HoldableGripPairOffsets;
  constructor(
    public lowestGripPoint: Vector,
    public angle: number,
    public distBetweenPairMembers: number,
    public distBetweenGripPairs: number | null = null,
    public lowestPointYOffsetFromHoldableBottom?: number,
    public stiffnesses = { main: { lower: 1, upper: 0.8 }, support: { lower: 0.7, upper: 0.5 } }
  ) {
    this.main = {
      lower: lowestGripPoint,
      upper: getPointInArc(lowestGripPoint, angle, -distBetweenPairMembers),
    };
    if (typeof distBetweenGripPairs === "number")
      this.support = {
        lower: getPointInArc(lowestGripPoint, angle, -distBetweenGripPairs - distBetweenPairMembers),
        upper: getPointInArc(lowestGripPoint, angle, -distBetweenGripPairs - distBetweenPairMembers * 2),
      };
  }
}

export class AttackInstructions {
  constructor(
    public steps: {
      position: HoldableGripConstraintCreationData;
      onReached?: () => void;
      onStart?: () => void;
    }[],
    public baseTimeout: number,
    public cooldown: number
  ) {}
}

export class Attack {
  timeStarted = +Date.now();
  shouldContinueAttackChain: boolean = false;
  nextAttack: AttackInstructions | null = null;
  currentPositionIndex: number = 0;
  constructor(public instructionSet: AttackInstructions) {}
  // if baseTimeout modified by handSpeed is reached, go to rest position and end attack
  // if attack input is received before execution of the last position, start the next attack instead of executing the last position
  // if guard input received, finish the current attack then enter guard position
}

export enum AttackDirections {
  LEFT,
  RIGHT,
  FORWARD,
}

export abstract class Holdable extends Entity {
  heldBy: MobileEntity | null = null;
  grips: {
    main: {
      upper: Matter.Constraint;
      lower: Matter.Constraint;
    };
    support?: {
      upper: Matter.Constraint;
      lower: Matter.Constraint;
    };
  } | null = null;
  attacks: {
    light?: {
      [AttackDirections.LEFT]?: AttackInstructions;
      [AttackDirections.RIGHT]?: AttackInstructions;
      [AttackDirections.FORWARD]?: AttackInstructions;
    };
    heavy?: AttackInstructions;
  } = {};
  isColliding = false;
  constructor(
    id: number,
    body: Body,
    public type: HoldableType,
    public requiresTwoHands: boolean,
    public length: number,
    public restPosition: HoldableGripConstraintCreationData,
    public guardPosition?: HoldableGripConstraintCreationData
  ) {
    super(id, body, 1, 0, { max: 10, current: 10 });
  }
  slideGrip = () => slideGrip(this);
}
