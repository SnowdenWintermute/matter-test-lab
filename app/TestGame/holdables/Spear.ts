import Matter, { Vector } from "matter-js";
import { Holdable, HoldableGripConstraintBodyOffsets, HoldableGripCreationData, HoldableType } from "./Holdable";
import { DistanceAndAngle } from "../common-classes";
import { getPointInArc } from "@/app/utils";

export class Spear extends Holdable {
  length = 110;
  positionOptions: {
    rest: HoldableGripConstraintBodyOffsets;
    // ready: HoldableGripConstraintBodyOffsets;
    // forwardStrike: HoldableGripCreationData;
  };

  constructor(position: Vector) {
    const body = Matter.Bodies.rectangle(position.x, position.y, 3, length, {
      isSensor: true,
    });
    const restGripACreationData = new DistanceAndAngle(18, Math.PI / 2);
    const restGripBCreationData = new DistanceAndAngle(20, (Math.PI / 4) * -1);
    const restGripCCreationData = new DistanceAndAngle(23, Math.PI / 2);
    const restGripOffset = -25;
    const readyGripACreationData = Vector.create(10, -14);
    const readyGripBCreationData = Vector.create(10, 12);
    const readyGripCCreationData = Vector.create(10, -19);
    const forwardStrikeGripACreationData = Vector.add(readyGripACreationData, { x: 0, y: 30 });
    const forwardStrikeGripBCreationData = Vector.add(readyGripBCreationData, { x: 0, y: 30 });

    super(1, body, HoldableType.SPEAR, true, {});
    this.positionOptions = {
      rest: new HoldableGripConstraintBodyOffsets({ x: 15, y: 5 }, Math.PI, 5, 30),
      // rest: new HoldableGripCreationData(restGripACreationData, restGripBCreationData, restGripCCreationData, restGripOffset),
      // ready: new HoldableGripCreationData(readyGripACreationData, readyGripBCreationData, readyGripCCreationData),
      // forwardStrike: new HoldableGripCreationData(forwardStrikeGripACreationData, forwardStrikeGripBCreationData),
    };
  }
  // Rest
  // Ready
  // Forward Strike
  // Left Strike
  // Right Strike
  // Left Guard
  // Right Guard
  // Center Guard
}
