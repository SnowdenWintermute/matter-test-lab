import Matter, { Vector } from "matter-js";
import { Entity } from "./Entity";

export enum CombatMoveExecutionState {
  AT_REST,
  READYING,
  EXECUTING,
  RETURNING_TO_READY,
  RETURNING_TO_REST,
}

export class MobileEntity extends Entity {
  targetAngle = 0;
  acceleration = 1;
  reverseAccelerationModifier = 0.4;
  sidewaysAccelerationModifier = 0.6;
  topSpeed: number = 10;
  turningSpeed = Math.PI / 12;
  jumpHeight = 20;
  jumpStrength = 1;
  jumping = false;
  spear: {
    body: Matter.Body;
    rightHandRestingPosition: Vector;
    leftHandRestingPosition: Vector;
    rightHandReadyPosition: Vector;
    leftHandReadyPosition: Vector;
  };
  desiredRightHandPosition: Matter.Constraint;
  desiredLeftHandPosition: Matter.Constraint;
  combatMoveExecutionState = CombatMoveExecutionState.AT_REST;
  constructor(
    engine: Matter.Engine,
    id: number,
    owner: string,
    acceleration: number,
    topSpeed: number,
    position: { x: number; y: number },
    turningSpeed?: number,
    jumpHeight?: number
  ) {
    const body = Matter.Bodies.polygon(position.x, position.y, 8, 40);
    body.frictionAir = 0.3;
    body.mass = 1000;
    Matter.Body.setAngle(body, -Math.PI / 2);
    super(id, body, 1, 1, owner, { max: 10, current: 10 });

    Matter.Composite.add(engine.world, body);

    this.acceleration = acceleration;
    this.topSpeed = topSpeed;
    if (turningSpeed) this.turningSpeed = turningSpeed;
    if (jumpHeight) this.jumpHeight = jumpHeight;
    this.spear = {
      body: Matter.Bodies.rectangle(position.x + 25, position.y - 15, 3, 95, {
        isSensor: true,
      }),
      rightHandRestingPosition: Vector.create(20, 5),
      leftHandRestingPosition: Vector.create(-20, -10),
      rightHandReadyPosition: Vector.create(-12, 5),
      leftHandReadyPosition: Vector.create(-12, -10),
    };
    Matter.Composite.add(engine.world, this.spear.body);
    this.desiredRightHandPosition = Matter.Constraint.create({
      bodyA: body,
      bodyB: this.spear.body,
      pointA: this.spear.rightHandRestingPosition,
      pointB: Vector.create(0, -25),
      stiffness: 0.9,
      length: 0,
    });
    this.desiredLeftHandPosition = Matter.Constraint.create({
      bodyA: body,
      bodyB: this.spear.body,
      pointA: this.spear.leftHandRestingPosition,
      pointB: Vector.create(0, 20),
      stiffness: 0.9,
      length: 0,
    });
    Matter.Composite.add(engine.world, this.desiredRightHandPosition);
    Matter.Composite.add(engine.world, this.desiredLeftHandPosition);
  }
}
