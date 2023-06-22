import Matter, { Vector } from "matter-js";
import { Holdable, HoldableGripCreationData, HoldableType } from "./Holdable";
import { DistanceAndAngle } from "../common-classes";

export class Spear extends Holdable {
  positionOptions: {
    rest: HoldableGripCreationData;
    ready: HoldableGripCreationData;
  };

  constructor(position: Vector) {
    const body = Matter.Bodies.rectangle(position.x + 25, position.y - 15, 3, 110, {
      isSensor: true,
    });
    body.mass = 3000;
    const restGripACreationData = new DistanceAndAngle(18, Math.PI / 2);
    const restGripBCreationData = new DistanceAndAngle(20, (Math.PI / 4) * -1);
    const restGripOffset = -25;
    const readyGripACreationData = Vector.create(-14, 10);
    const readyGripBCreationData = Vector.create(12, 10);

    super(1, body, HoldableType.SPEAR, true, {});
    this.positionOptions = {
      rest: new HoldableGripCreationData(restGripACreationData, restGripBCreationData, restGripOffset),
      ready: new HoldableGripCreationData(readyGripACreationData, readyGripBCreationData),
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
