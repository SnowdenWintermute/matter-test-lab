import Matter, { Vector } from "matter-js";
import { Holdable, HoldableType } from "./Holdable";
import { HoldableGripConstraintCreationData } from "./HoldableGripConstraintCreationData";

export class Spear extends Holdable {
  // length = 110;
  // width = 3;
  // distBetweenGripPairMembers = 10;
  // positionOptions = {
  //   rest: new HoldableGripConstraintCreationData({ x: 15, y: 5 }, Math.PI / 5, this.distBetweenGripPairMembers, 30, 10),
  //   ready: new HoldableGripConstraintCreationData({ x: 8, y: 10 }, Math.PI / 2, this.distBetweenGripPairMembers, 40, 10),
  //   forwardStrike: new HoldableGripConstraintCreationData({ x: 8, y: -40 }, Math.PI / 2, this.distBetweenGripPairMembers, 20, 10),
  // };
  // constructor(id: number, position: Vector) {
  //   const length = 110;
  //   const width = 3;
  //   const body = Matter.Bodies.rectangle(position.x, position.y, width, length, {
  //     isSensor: true,
  //   });
  //   super(id, body, HoldableType.SPEAR, true, length);
  // }
}
