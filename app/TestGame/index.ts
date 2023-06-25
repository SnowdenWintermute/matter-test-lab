import Matter, { Body, Resolver, Vector } from "matter-js";
import { MobileEntity } from "./entities/MobileEntity";
import { Entity } from "./entities/Entity";
import { CSPlayerInputState } from "./CSInputState";
import handlePlayerInputs from "./handlePlayerInputs";
import render from "./render";
import { MouseState } from "./MouseState";
import { Holdable, HoldableType } from "./holdables/Holdable";
import { Spear } from "./holdables/Spear";
import createRandomlyPlacedCircleEntities from "./createRandomlyPlacedCircleEntities";
import handleCollision from "./handleCollision";
import { EntityCategory } from "./enums";

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
    Matter.Events.on(this.physicsEngine, "collisionStart", (e) => this.handleCollision(e, this));
    // Matter.Events.on(this.physicsEngine, "collisionStart", ())
    // createRandomlyPlacedCircleEntities(this);
    const playerEntity = this.createRegisteredPlayerEntity({
      x: 250,
      y: 250,
    });
    const playerEntity2 = this.createRegisteredPlayerEntity(
      {
        x: 250,
        y: 350,
      }
      // { static: true }
    );
    const spear = this.createRegisteredHoldable(HoldableType.SPEAR, playerEntity.body.position);
    playerEntity.equipHoldable(spear);
    const spear2 = this.createRegisteredHoldable(HoldableType.SPEAR, playerEntity2.body.position);
    playerEntity2.equipHoldable(spear2);

    for (let i = 0; i < 4; i += 1) this.createRegisteredTargetDummy({ y: 100, x: 50 + 100 * i }, { x: 25 + 25 * i, y: 25 + 40 * i }, 10 + 10000 * i);

    this.createRegisteredStaticEntity({ x: 0, y: 0 }, { x: 5, y: 1000 });
    this.createRegisteredStaticEntity({ x: 0, y: 0 }, { x: 1000, y: 5 });
    this.createRegisteredStaticEntity({ x: 500, y: 0 }, { x: 5, y: 1000 });
    this.createRegisteredStaticEntity({ x: 0, y: 500 }, { x: 1000, y: 5 });
  }

  createRegisteredStaticEntity(position: Vector, size: Vector) {
    this.entities.lastIdAssigned += 1;
    const id = this.entities.lastIdAssigned;
    const body = Matter.Bodies.rectangle(position.x, position.y, size.x, size.y, { isStatic: true });
    Matter.Composite.add(this.physicsEngine.world, body);
    this.entities.static[id] = new Entity(id, body, 1, 0, { max: 1, current: 1 });
    return this.entities.mobile[id];
  }

  createRegisteredTargetDummy(position: Vector, size: Vector, mass?: number) {
    this.entities.lastIdAssigned += 1;
    const id = this.entities.lastIdAssigned;
    const body = Matter.Bodies.rectangle(position.x, position.y, size.x, size.y);
    if (mass) body.mass = mass;
    Matter.Composite.add(this.physicsEngine.world, body);
    this.entities.mobile[id] = new MobileEntity(id, this.physicsEngine, body, "game", 2, 10);
    return this.entities.mobile[id];
  }

  createRegisteredPlayerEntity(position: Vector, options?: { static?: boolean }) {
    this.entities.lastIdAssigned += 1;
    const id = this.entities.lastIdAssigned;
    const body = Matter.Bodies.polygon(position.x, position.y, 8, 40);
    body.frictionAir = 0.3;
    const startingAngle = -Math.PI / 2;
    Matter.Body.setAngle(body, startingAngle);
    body.label = `${EntityCategory.PLAYER_CONTROLLED}-${id}`;
    if (options?.static) body.isStatic = true;
    Matter.Composite.add(this.physicsEngine.world, body);
    this.entities.playerControlled[id] = new MobileEntity(id, this.physicsEngine, body, "player");
    return this.entities.playerControlled[id];
  }

  createRegisteredHoldable(type: HoldableType, position: Vector) {
    this.entities.lastIdAssigned += 1;
    const id = this.entities.lastIdAssigned;
    const holdable = new Spear(position);
    holdable.body.label = `${EntityCategory.HOLDABLE}-${id}`;
    this.entities.holdable[id] = holdable;
    Matter.Composite.add(this.physicsEngine.world, holdable.body);
    return holdable;
  }

  clearPhysicsInterval() {
    clearTimeout(this.intervals.physics);
    this.intervals.physics = undefined;
  }

  handleCollision = handleCollision;

  stepGame(context: CanvasRenderingContext2D, canvasSize: { width: number; height: number }) {
    this.intervals.physics = setTimeout(() => {
      handlePlayerInputs(this);
      Matter.Engine.update(this.physicsEngine, this.renderRate);
      render(context, this, canvasSize);
      this.stepGame(context, canvasSize);
    }, this.renderRate);
  }
}
