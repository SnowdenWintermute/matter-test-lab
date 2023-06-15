import Matter, { Vector } from "matter-js";
import { Entity } from "./Entity";
import { warn } from "console";

export class MobileEntity extends Entity {
  targetAngle = 0;
  acceleration = 1;
  reverseAccelerationModifier = 0.4;
  sidewaysAccelerationModifier = 0.6;
  topSpeed: number = 10;
  turningSpeed = Math.PI / 20;
  jumpHeight = 20;
  jumpStrength = 1;
  jumping = false;
  spear: Matter.Body;
  desiredRightHandPosition: Matter.Constraint;
  desiredLeftHandPosition: Matter.Constraint;
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

    this.spear = Matter.Bodies.rectangle(
      position.x + 25,
      position.y - 15,
      3,
      95,
      { isSensor: true }
    );
    Matter.Composite.add(engine.world, this.spear);
    this.desiredRightHandPosition = Matter.Constraint.create({
      bodyA: body,
      bodyB: this.spear,
      pointA: Vector.create(20, 5),
      pointB: Vector.create(0, -10),
      // stiffness: 0.9,
      length: 1,
    });
    this.desiredLeftHandPosition = Matter.Constraint.create({
      bodyA: body,
      bodyB: this.spear,
      pointA: Vector.create(-20, -10),
      pointB: Vector.create(0, 20),
      // stiffness: 0.9,
      length: 1,
    });
    Matter.Composite.add(engine.world, this.desiredRightHandPosition);
    Matter.Composite.add(engine.world, this.desiredLeftHandPosition);
  }
}
