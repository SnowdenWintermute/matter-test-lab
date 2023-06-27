import Matter, { Vector } from "matter-js";
import { Holdable, HoldableGripConstraintBodyOffsets, HoldableType } from "./Holdable";

export class Spear extends Holdable {
  positionOptions = {
    rest: new HoldableGripConstraintBodyOffsets({ x: -15, y: -5 }, Math.PI / 5, 10, 30, 10),
    // ready: HoldableGripConstraintBodyOffsets;
    // forwardStrike: HoldableGripCreationData;
  };

  constructor(position: Vector) {
    const length = 110;
    const body = Matter.Bodies.rectangle(position.x, position.y, 3, length, {
      isSensor: true,
    });
    super(1, body, HoldableType.SPEAR, true, length);
  }
  // Rest
  // Ready
  // Forward Strike
  // Left Strike
  // Right Strike
  // Left Guard
  // Right Guard
  // Center Guard
  // const restGripACreationData = new DistanceAndAngle(18, Math.PI / 2);
  // const restGripBCreationData = new DistanceAndAngle(20, (Math.PI / 4) * -1);
  // const restGripCCreationData = new DistanceAndAngle(23, Math.PI / 2);
  // const restGripOffset = -25;
  // const readyGripACreationData = Vector.create(10, -14);
  // const readyGripBCreationData = Vector.create(10, 12);
  // const readyGripCCreationData = Vector.create(10, -19);
  // const forwardStrikeGripACreationData = Vector.add(readyGripACreationData, { x: 0, y: 30 });
  // const forwardStrikeGripBCreationData = Vector.add(readyGripBCreationData, { x: 0, y: 30 });
}
