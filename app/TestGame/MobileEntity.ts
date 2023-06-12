import Matter from "matter-js";
import { Entity } from "./Entity";
import { warn } from "console";

export class MobileEntity extends Entity {
  targetAngle = 0;
  acceleration = 1;
  reverseAccelerationModifier = 0.5;
  sidewaysAccelerationModifier = 0.7;
  topSpeed: number = 10;
  turningSpeed = Math.PI / 10;
  jumpHeight = 20;
  jumpStrength = 1;
  jumping = false;
  constructor(
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
    this.acceleration = acceleration;
    this.topSpeed = topSpeed;
    if (turningSpeed) this.turningSpeed = turningSpeed;
    if (jumpHeight) this.jumpHeight = jumpHeight;
  }
}
