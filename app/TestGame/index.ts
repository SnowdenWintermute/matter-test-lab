import Matter, { Body, Constraint, Vector } from "matter-js";
import { MobileEntity } from "./entities/MobileEntity";
import { Entity } from "./entities/Entity";
import { CSPlayerInputState } from "./CSInputState";
import handlePlayerInputs from "./handlePlayerInputs";
import render from "./render";
import { MouseState } from "./MouseState";
import { Holdable, HoldableType } from "./holdables/Holdable";
import { Spear } from "./holdables/Spear";
import handleCollisionStart from "./handleCollisions/handleCollisionStart";
import { EntityCategory } from "./enums";
import equipHoldableToEntity from "./equipHoldableToEntity";
import cloneDeep from "lodash.clonedeep";
import handleCollisionEnd from "./handleCollisions/handleCollisionEnd";
import handleCollisionActive from "./handleCollisions/handleCollisionActive";
import updateTraumas from "./updateTraumas";
import { WidthAndHeight } from "./common-classes";

export class CSEntities {
  lastIdAssigned = -1;
  playerControlled: { [id: number]: MobileEntity } = {};
  mobile: { [id: number]: MobileEntity } = {};
  static: { [id: number]: Entity } = {};
  holdable: { [id: number]: Holdable } = {};
  experiencingTrauma: { [entityId: number]: { id: number; category: EntityCategory } } = {};
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
    Matter.Events.on(this.physicsEngine, "collisionStart", (e) => this.handleCollisionStart(e, this));
    Matter.Events.on(this.physicsEngine, "collisionActive", (e) => this.handleCollisionActive(e, this));
    Matter.Events.on(this.physicsEngine, "collisionEnd", (e) => this.handleCollisionEnd(e, this));

    // createRandomlyPlacedCircleEntities(this);
    const playerEntity = this.createRegisteredPlayerEntity({ x: 200, y: 250 });
    const playerEntity2 = this.createRegisteredPlayerEntity({ x: 370, y: 250 });
    const spear = this.createRegisteredHoldable(HoldableType.SPEAR, { x: playerEntity.body.position.x, y: playerEntity.body.position.y });
    this.equipHoldableToEntity(this, playerEntity, spear);
    // const spear2 = this.createRegisteredHoldable(HoldableType.SPEAR, playerEntity2.body.position);
    // this.equipHoldableToEntity(this, playerEntity2, spear2);
    this.createBorderWalls({ width: 800, height: 600 }, { x: 5, y: 5 });

    this.createRegisteredStaticEntity({ x: 200, y: 400 }, { width: 30, height: 30 });
  }

  createBorderWalls(size: WidthAndHeight, offset: Vector, thickness: number = 5) {
    const { width, height } = size;
    const x = offset.x + width / 2;
    const y = offset.y + height / 2;
    this.createRegisteredStaticEntity({ x, y: offset.y }, { width, height: thickness });
    this.createRegisteredStaticEntity({ x: offset.x, y }, { width: thickness, height });
    this.createRegisteredStaticEntity({ x, y: offset.y + height }, { width: width, height: thickness });
    this.createRegisteredStaticEntity({ x: offset.x + width, y }, { width: thickness, height });
  }

  createRegisteredStaticEntity(position: Vector, size: WidthAndHeight) {
    this.entities.lastIdAssigned += 1;
    const id = this.entities.lastIdAssigned;
    const body = Matter.Bodies.rectangle(position.x, position.y, size.width, size.height, { isStatic: true });
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
    this.entities.mobile[id] = new MobileEntity(id, body, "game", 2, 10);
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
    this.entities.playerControlled[id] = new MobileEntity(id, body, "player");
    return this.entities.playerControlled[id];
  }

  createRegisteredHoldable(type: HoldableType, position: Vector) {
    this.entities.lastIdAssigned += 1;
    const id = this.entities.lastIdAssigned;
    const holdable = new Spear(id, position);
    holdable.body.label = `${EntityCategory.HOLDABLE}-${id}`;
    this.entities.holdable[id] = holdable;
    Matter.Composite.add(this.physicsEngine.world, holdable.body);
    return holdable;
  }

  createGripPosition(
    body: Body,
    holdable: Holdable,
    gripPositionBodyOffset: Vector,
    holdableOffsetY = 0,
    options: { stiffness: number; length: number } = { stiffness: 1, length: 0 }
  ) {
    const gripPosition = Matter.Constraint.create({
      bodyA: body,
      bodyB: holdable.body,
      pointA: cloneDeep(gripPositionBodyOffset),
      pointB: { x: 0, y: holdableOffsetY },
      stiffness: options.stiffness,
      length: options.length,
    });
    Matter.Composite.add(this.physicsEngine.world, gripPosition);
    return gripPosition;
  }

  equipHoldableToEntity = equipHoldableToEntity;

  cleanup() {
    clearTimeout(this.intervals.physics);
    // Matter.Composite.clear(this.physicsEngine.world, false, true);
    this.intervals.physics = undefined;
  }

  handleCollisionStart = handleCollisionStart;
  handleCollisionEnd = handleCollisionEnd;
  handleCollisionActive = handleCollisionActive;

  stepGame(context: CanvasRenderingContext2D, canvasSize: { width: number; height: number }) {
    this.intervals.physics = setTimeout(() => {
      handlePlayerInputs(this);
      Matter.Engine.update(this.physicsEngine, this.renderRate);
      updateTraumas(this);
      if (Object.keys(this.entities.playerControlled).length < 2) {
        const x = Math.floor(Math.random() * 500);
        const y = Math.floor(Math.random() * 500);
        this.createRegisteredPlayerEntity({ x, y });
      }
      render(context, this, canvasSize);
      this.stepGame(context, canvasSize);
    }, this.renderRate);
  }
}
