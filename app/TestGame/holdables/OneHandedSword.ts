import Matter, { Vector } from "matter-js";
import { Holdable, HoldableType } from "./Holdable";
import { ArcMovementParameters, AttackDirections, AttackInstructions, AttackStep, DamageType, MovementType } from "../entities/Attack";
import { HoldableGripConstraintCreationData } from "./HoldableGripConstraintCreationData";

const length = 60;
const width = 5;
const distBetweenGripPairMembers = 10;
const baseStepTimeout = 5000;

export class OneHandedSword extends Holdable {
  width = width;
  attacks = {
    light: {
      [AttackDirections.LEFT]: new AttackInstructions(
        [
          new AttackStep(
            new HoldableGripConstraintCreationData({ x: 10, y: 35 }, Math.PI / 4, distBetweenGripPairMembers, 10, 10),
            MovementType.LINEAR,
            DamageType.NONE
          ),
          new AttackStep(
            new HoldableGripConstraintCreationData(null, Math.PI / 4, distBetweenGripPairMembers, 10, 10),
            MovementType.ARC,
            DamageType.SLASHING,
            new ArcMovementParameters({ x: 10, y: 10 }, 20, -1)
          ),
          new AttackStep(
            new HoldableGripConstraintCreationData(null, 0, distBetweenGripPairMembers, 10, 10),
            MovementType.ARC,
            DamageType.SLASHING,
            new ArcMovementParameters({ x: 10, y: 10 }, 40, -1)
          ),
          new AttackStep(
            new HoldableGripConstraintCreationData(null, -Math.PI / 3, distBetweenGripPairMembers, 10, 10),
            MovementType.ARC,
            DamageType.SLASHING,
            new ArcMovementParameters({ x: 10, y: 10 }, 50, -1)
          ),
        ],
        baseStepTimeout,
        0
      ),
      [AttackDirections.RIGHT]: new AttackInstructions(
        [
          new AttackStep(
            new HoldableGripConstraintCreationData(null, -0.1, distBetweenGripPairMembers, 10, 10),
            MovementType.PERPENDICULAR_ARC,
            DamageType.SLASHING,
            new ArcMovementParameters({ x: 10, y: 10 }, 20, 1)
          ),
          new AttackStep(
            new HoldableGripConstraintCreationData(null, 0.3, distBetweenGripPairMembers, 10, 10),
            MovementType.PERPENDICULAR_ARC,
            DamageType.SLASHING,
            new ArcMovementParameters({ x: 10, y: 10 }, 30, 1)
          ),
          new AttackStep(
            new HoldableGripConstraintCreationData(null, 0.6, distBetweenGripPairMembers, 10, 10),
            MovementType.ARC,
            DamageType.SLASHING,
            new ArcMovementParameters({ x: 10, y: 10 }, 40, 1)
          ),
          new AttackStep(
            new HoldableGripConstraintCreationData(null, 1.2, distBetweenGripPairMembers, 10, 10),
            MovementType.ARC,
            DamageType.SLASHING,
            new ArcMovementParameters({ x: 10, y: 10 }, 30, 1)
          ),
          new AttackStep(
            new HoldableGripConstraintCreationData(null, 1.6, distBetweenGripPairMembers, 10, 10),
            MovementType.ARC,
            DamageType.SLASHING,
            new ArcMovementParameters({ x: 10, y: 10 }, 20, 1)
          ),
        ],
        baseStepTimeout,
        0
      ),
      [AttackDirections.FORWARD]: new AttackInstructions(
        [
          new AttackStep(new HoldableGripConstraintCreationData({ x: 5, y: 25 }, 0, distBetweenGripPairMembers, 10, 10), MovementType.LINEAR, DamageType.NONE),
          new AttackStep(new HoldableGripConstraintCreationData({ x: 50, y: 25 }, 0, distBetweenGripPairMembers, 10, 10), MovementType.LINEAR, DamageType.NONE),
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
      false,
      length,
      new HoldableGripConstraintCreationData({ x: 5, y: 25 }, 0, distBetweenGripPairMembers, 10, 10)
    );
  }
}
