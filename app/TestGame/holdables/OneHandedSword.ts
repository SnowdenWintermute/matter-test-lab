import Matter, { Vector } from "matter-js";
import { Holdable, HoldableGripConstraintCreationData, HoldableType } from "./Holdable";
import { AttackDirections, AttackInstructions, DamageType } from "../entities/Attack";

const length = 60;
const width = 3;
const distBetweenGripPairMembers = 10;
export class OneHandedSword extends Holdable {
  width = width;
  attacks = {
    light: {
      [AttackDirections.LEFT]: new AttackInstructions(
        [
          {
            position: new HoldableGripConstraintCreationData({ x: 25, y: -10 }, Math.PI / 1.25, distBetweenGripPairMembers, 10, 10),
            damageType: DamageType.NONE,
          },
          {
            position: new HoldableGripConstraintCreationData({ x: 7, y: -40 }, Math.PI / 2, distBetweenGripPairMembers, 10, 10),
            damageType: DamageType.SLASHING,
          },
          {
            position: new HoldableGripConstraintCreationData({ x: -25, y: -30 }, Math.PI / 4, distBetweenGripPairMembers, 10, 10),
            damageType: DamageType.SLASHING,
          },
        ],
        3000,
        0
      ),
      [AttackDirections.RIGHT]: new AttackInstructions(
        [
          {
            position: new HoldableGripConstraintCreationData({ x: -10, y: -10 }, Math.PI / 2, distBetweenGripPairMembers, 10, 10),
            damageType: DamageType.PIERCING,
          },
          {
            position: new HoldableGripConstraintCreationData({ x: 25, y: -15 }, -Math.PI / 3, distBetweenGripPairMembers, 10, 10),
            damageType: DamageType.SLASHING,
          },
        ],
        3000,
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
      new HoldableGripConstraintCreationData({ x: 25, y: -5 }, Math.PI / 2, distBetweenGripPairMembers, 10, 10)
    );
  }
}
