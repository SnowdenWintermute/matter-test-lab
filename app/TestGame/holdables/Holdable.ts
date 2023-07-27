import { Body, Vector } from "matter-js";
import { Entity } from "../entities/Entity";
import { MobileEntity } from "../entities/MobileEntity";
import Matter from "matter-js";
import slideGrip from "./slideGrip";
import { AttackDirections, AttackInstructions, MovementType } from "../entities/Attack";
import { HoldableGripConstraintCreationData } from "./HoldableGripConstraintCreationData";

export enum HoldableType {
  SPEAR,
  ONE_HANDED_SWORD,
  SHIELD,
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
  previousAttackStep: {
    arcCenter?: Vector;
    movementType?: MovementType;
  } = {};
  constructor(
    id: number,
    body: Body,
    public type: HoldableType,
    public requiresTwoHands: boolean,
    public isOffHand: boolean,
    public length: number,
    public restPosition: HoldableGripConstraintCreationData,
    public guardPosition?: HoldableGripConstraintCreationData
  ) {
    super(id, body, 1, 0, { max: 10, current: 10 });
  }
  slideGrip = () => slideGrip(this);
}
