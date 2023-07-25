import Matter, { Vector } from "matter-js";
import { Holdable, HoldableGripConstraintCreationData, HoldableType } from "./Holdable";
import { AttackDirections, AttackInstructions, DamageType, MovementType } from "../entities/Attack";

const length = 60;
const width = 3;
const distBetweenGripPairMembers = 10;
const baseStepTimeout = 5000;

export class OneHandedSword extends Holdable {
  width = width;
  attacks = {
    light: {
      [AttackDirections.LEFT]: new AttackInstructions(
        [
          {
            position: new HoldableGripConstraintCreationData({ x: 10, y: 35 }, Math.PI / 4, distBetweenGripPairMembers, 10, 10),
            movementType: MovementType.LINEAR,
            damageType: DamageType.NONE,
          },
          {
            position: new HoldableGripConstraintCreationData({ x: 30, y: 0 }, Math.PI / 4, distBetweenGripPairMembers, 10, 10),
            movementType: MovementType.ARC,
            arcEndingRadius: 20,
            arcCenterOffsetFromBody: { x: 10, y: 10 },
            arcDirection: -1,
            damageType: DamageType.SLASHING,
          },
          {
            position: new HoldableGripConstraintCreationData({ x: 30, y: 0 }, 0, distBetweenGripPairMembers, 10, 10),
            movementType: MovementType.ARC,
            arcEndingRadius: 40,
            arcCenterOffsetFromBody: { x: 10, y: 10 },
            arcDirection: -1,
            damageType: DamageType.SLASHING,
          },
          {
            position: new HoldableGripConstraintCreationData({ x: 10, y: -40 }, -Math.PI / 3, distBetweenGripPairMembers, 10, 10),
            movementType: MovementType.ARC,
            arcEndingRadius: 50,
            arcCenterOffsetFromBody: { x: 10, y: 10 },
            arcDirection: -1,
            damageType: DamageType.SLASHING,
          },
        ],
        baseStepTimeout,
        0
      ),
      [AttackDirections.RIGHT]: new AttackInstructions(
        [
          {
            position: new HoldableGripConstraintCreationData({ x: 20, y: -25 }, -Math.PI / 2, distBetweenGripPairMembers, 10, 10),
            movementType: MovementType.LINEAR,
            damageType: DamageType.NONE,
          },
          {
            position: new HoldableGripConstraintCreationData({ x: 10, y: -40 }, -Math.PI / 2, distBetweenGripPairMembers, 10, 10),
            movementType: MovementType.ARC,
            arcEndingRadius: 20,
            arcCenterOffsetFromBody: { x: 10, y: 10 },
            arcDirection: -1,
            damageType: DamageType.SLASHING,
          },
          {
            position: new HoldableGripConstraintCreationData({ x: 30, y: 0 }, -Math.PI / 6, distBetweenGripPairMembers, 10, 10),
            movementType: MovementType.ARC,
            arcEndingRadius: 40,
            arcCenterOffsetFromBody: { x: 10, y: 10 },
            arcDirection: 1,
            damageType: DamageType.SLASHING,
          },
          {
            position: new HoldableGripConstraintCreationData({ x: 30, y: 0 }, 1.2, distBetweenGripPairMembers, 10, 10),
            movementType: MovementType.ARC,
            arcEndingRadius: 10,
            arcCenterOffsetFromBody: { x: 10, y: 10 },
            arcDirection: 1,
            damageType: DamageType.SLASHING,
          },
        ],
        baseStepTimeout,
        0
      ),
      [AttackDirections.FORWARD]: new AttackInstructions(
        [
          {
            position: new HoldableGripConstraintCreationData({ x: 5, y: 25 }, 0, distBetweenGripPairMembers, 10, 10),
            movementType: MovementType.LINEAR,
            damageType: DamageType.NONE,
          },
          {
            position: new HoldableGripConstraintCreationData({ x: 50, y: 25 }, 0, distBetweenGripPairMembers, 10, 10),
            movementType: MovementType.LINEAR,
            damageType: DamageType.PIERCING,
          },
        ],
        baseStepTimeout,
        0
      ),
    },
  };

  constructor(id: number, position: Vector) {
    const body = Matter.Bodies.rectangle(position.x, position.y, width, length, {
      isSensor: true,
    });
    super(
      id,
      body,
      HoldableType.ONE_HANDED_SWORD,
      false,
      length,
      new HoldableGripConstraintCreationData({ x: 5, y: 25 }, 0, distBetweenGripPairMembers, 10, 10)
    );
  }
}
