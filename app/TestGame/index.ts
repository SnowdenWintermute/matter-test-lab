import Matter from "matter-js";
import { MobileEntity } from "./MobileEntity";
import { Entity } from "./Entity";
import { CSPlayerInputState } from "./CSInputState";
import handlePlayerInputs from "./handlePlayerInputs";
import render from "./render";

export class CSEntities {
  playerControlled: { [id: number]: MobileEntity } = {};
  mobile: { [id: number]: MobileEntity } = {};
  static: { [id: number]: Entity } = {};
}

export class TestGame {
  physicsEngine: Matter.Engine = Matter.Engine.create();
  intervals: {
    physics: NodeJS.Timeout | undefined;
    render: NodeJS.Timeout | undefined;
  } = { physics: undefined, render: undefined };
  entities = new CSEntities();
  inputState = new CSPlayerInputState();
  renderRate = 33;
  constructor() {
    this.physicsEngine.gravity.y = 0;
    this.physicsEngine.gravity.x = 0;
    this.physicsEngine.gravity.scale = 0;
  }

  clearPhysicsInterval() {
    clearTimeout(this.intervals.physics);
    this.intervals.physics = undefined;
  }

  stepGame(
    context: CanvasRenderingContext2D,
    canvasSize: { width: number; height: number }
  ) {
    this.intervals.physics = setTimeout(() => {
      handlePlayerInputs(this);
      Matter.Engine.update(this.physicsEngine, this.renderRate);
      render(context, this, canvasSize);
      this.stepGame(context, canvasSize);
    }, this.renderRate);
  }
}
