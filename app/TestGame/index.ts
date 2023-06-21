import Matter, { Vector } from "matter-js";
import { MobileEntity } from "./entities/MobileEntity";
import { Entity } from "./entities/Entity";
import { CSPlayerInputState } from "./CSInputState";
import handlePlayerInputs from "./handlePlayerInputs";
import render from "./render";
import { MouseState } from "./MouseState";
import { Holdable, HoldableType } from "./holdables/Holdable";
import { Spear } from "./holdables/Spear";

export class CSEntities {
  lastIdAssigned = -1;
  playerControlled: { [id: number]: MobileEntity } = {};
  mobile: { [id: number]: MobileEntity } = {};
  static: { [id: number]: Entity } = {};
  holdable: { [id: number]: Holdable } = {};
}

export class TestGame {
  physicsEngine: Matter.Engine = Matter.Engine.create();
  intervals: {
    physics: NodeJS.Timeout | undefined;
    render: NodeJS.Timeout | undefined;
  } = { physics: undefined, render: undefined };
  canvasSize = { height: 1920, width: 1080 };
  entities = new CSEntities();
  inputState = new CSPlayerInputState();
  prevInputState = new CSPlayerInputState();
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
    const playerEntity = this.createRegisteredPlayerEntity({
      x: 250,
      y: 250,
    });
    const spear = this.createRegisteredHoldable(HoldableType.SPEAR, playerEntity.body.position);
    playerEntity.equipHoldable(spear);
  }

  createRegisteredPlayerEntity(position: Vector) {
    this.entities.lastIdAssigned += 1;
    const id = this.entities.lastIdAssigned;
    const body = Matter.Bodies.polygon(position.x, position.y, 8, 40);
    body.frictionAir = 0.3;
    body.mass = 500;
    const startingAngle = -Math.PI / 2;
    Matter.Body.setAngle(body, startingAngle);
    Matter.Composite.add(this.physicsEngine.world, body);
    this.entities.playerControlled[id] = new MobileEntity(id, this.physicsEngine, body, "player", 2, 10);
    return this.entities.playerControlled[id];
  }

  createRegisteredHoldable(type: HoldableType, position: Vector) {
    this.entities.lastIdAssigned += 1;
    const id = this.entities.lastIdAssigned;
    const holdable = new Spear(position);
    this.entities.holdable[id] = holdable;
    Matter.Composite.add(this.physicsEngine.world, holdable.body);
    return holdable;
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
