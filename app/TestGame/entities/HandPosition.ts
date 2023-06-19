import { Vector } from "matter-js";

export class HandPosition {
  constructor(public inWorld: Vector, public offset: Vector, public angle: number, public distance: number) {}
}
