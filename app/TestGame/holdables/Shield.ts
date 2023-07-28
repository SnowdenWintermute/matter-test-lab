import Matter, { Vector } from "matter-js";
import { Holdable, HoldableType } from "./Holdable";
import { ArcMovementParameters, AttackDirections, AttackInstructions, AttackStep, DamageType, MovementType } from "../entities/Attack";
import { HoldableGripConstraintCreationData } from "./HoldableGripConstraintCreationData";

const length = 35;
const width = 10;
const distBetweenGripPairMembers = length / 2;
const distBetweenGripPairs = 0;
const lowestGripOffsetFromBottom = length / 2;
const baseStepTimeout = 5000;

export class Shield extends Holdable {
  width = width;
  attacks = {
    light: {
      [AttackDirections.LEFT]: new AttackInstructions(
        [
          new AttackStep(
            new HoldableGripConstraintCreationData(null, -0.7, distBetweenGripPairMembers, 10, 10),
            MovementType.PERPENDICULAR_ARC,
            DamageType.SLASHING,
            new ArcMovementParameters({ x: 0, y: 0 }, 40, -1, -1),
            { speedModifier: 0.75 }
          ),
          new AttackStep(
            new HoldableGripConstraintCreationData(null, -1.5, distBetweenGripPairMembers, 10, 10),
            MovementType.PERPENDICULAR_ARC,
            DamageType.SLASHING,
            new ArcMovementParameters({ x: 0, y: 0 }, 40, -1, -1),
            { speedModifier: 0.75 }
          ),
          new AttackStep(
            new HoldableGripConstraintCreationData(null, -2.3, distBetweenGripPairMembers, 10, 10),
            MovementType.PERPENDICULAR_ARC,
            DamageType.SLASHING,
            new ArcMovementParameters({ x: 0, y: 0 }, 40, -1, -1),
            { speedModifier: 0.75 }
          ),
        ],
        baseStepTimeout,
        0
      ),
      [AttackDirections.RIGHT]: new AttackInstructions(
        [
          new AttackStep(
            new HoldableGripConstraintCreationData(null, -Math.PI / 2, distBetweenGripPairMembers, 10, 10),
            MovementType.PERPENDICULAR_ARC,
            DamageType.SLASHING,
            new ArcMovementParameters({ x: 0, y: -20 }, 15, 1, -1),
            { speedModifier: 0.9 }
          ),
          new AttackStep(
            new HoldableGripConstraintCreationData(null, -Math.PI / 5, distBetweenGripPairMembers, 10, 10),
            MovementType.PERPENDICULAR_ARC,
            DamageType.SLASHING,
            new ArcMovementParameters({ x: 0, y: -20 }, 35, 1, -1),
            { speedModifier: 0.7 }
          ),
          new AttackStep(
            new HoldableGripConstraintCreationData(null, 0, distBetweenGripPairMembers, 10, 10),
            MovementType.PERPENDICULAR_ARC,
            DamageType.SLASHING,
            new ArcMovementParameters({ x: 0, y: -20 }, 40, 1, -1),
            { speedModifier: 0.5 }
          ),
        ],
        baseStepTimeout,
        0
      ),
      [AttackDirections.FORWARD]: new AttackInstructions(
        [
          new AttackStep(
            new HoldableGripConstraintCreationData(null, 0, distBetweenGripPairMembers, 10, 10),
            MovementType.PERPENDICULAR_ARC,
            DamageType.SLASHING,
            new ArcMovementParameters({ x: 0, y: -20 }, 40, 1, -1),
            { speedModifier: 0.5 }
          ),
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
      HoldableType.SHIELD,
      false,
      true,
      length,
      new HoldableGripConstraintCreationData({ x: 25, y: -25 }, 1, distBetweenGripPairMembers, null, lowestGripOffsetFromBottom)
    );
  }
}
