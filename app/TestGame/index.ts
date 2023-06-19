import Matter from "matter-js";
import { MobileEntity } from "./entities/MobileEntity";
import { Entity } from "./entities/Entity";
import { CSPlayerInputState } from "./CSInputState";
import handlePlayerInputs from "./handlePlayerInputs";
import render from "./render";
import { MouseState } from "./MouseState";

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
  mouseState = new MouseState();
  renderRate = 33;
  constructor() {
    this.physicsEngine.gravity.y = 0;
    this.physicsEngine.gravity.x = 0;
    this.physicsEngine.gravity.scale = 0;
    // for (let i = 0; i < 20; i += 1) {
    //   const x = Math.random() * 500;
    //   const y = Math.random() * 500;
    //   const r = Math.random() * 30;
    //   const body = Matter.Bodies.circle(x, y, r);
    //   this.entities.static[i] = new Entity(i, body, 0, 0, "game", {
    //     max: 1,
    //     current: 1,
    //   });
    //   Matter.Composite.add(this.physicsEngine.world, body);
    // }
  }

  clearPhysicsInterval() {
    clearTimeout(this.intervals.physics);
    this.intervals.physics = undefined;
  }

  stepGame(context: CanvasRenderingContext2D, canvasSize: { width: number; height: number }) {
    this.intervals.physics = setTimeout(() => {
      handlePlayerInputs(this);
      Matter.Engine.update(this.physicsEngine, this.renderRate);
      render(context, this, canvasSize);
      this.stepGame(context, canvasSize);
    }, this.renderRate);
  }
}
