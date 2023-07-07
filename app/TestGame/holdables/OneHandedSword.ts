import Matter, { Vector } from "matter-js";
import { Holdable, HoldableGripConstraintCreationData, HoldableType } from "./Holdable";

const length = 60;

export class OneHandedSword extends Holdable {
  width = 3;
  distBetweenGripPairMembers = 10;
  positionOptions = {
    rest: new HoldableGripConstraintCreationData({ x: 25, y: -5 }, Math.PI / 2, this.distBetweenGripPairMembers, 2, 10),
    ready: new HoldableGripConstraintCreationData({ x: 25, y: -10 }, Math.PI / 3, this.distBetweenGripPairMembers, 10, 10),
    forwardStrike: new HoldableGripConstraintCreationData({ x: 25, y: -20 }, Math.PI / 2, this.distBetweenGripPairMembers, 10, 10),
  };

  constructor(id: number, position: Vector) {
    const width = 3;
    const body = Matter.Bodies.rectangle(position.x, position.y, width, length, {
      isSensor: true,
    });
    super(id, body, HoldableType.ONE_HANDED_SWORD, false, length);
  }
}
