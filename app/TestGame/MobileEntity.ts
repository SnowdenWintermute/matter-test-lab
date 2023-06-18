import Matter, { Vector } from "matter-js";
import { Entity } from "./Entity";
import cloneDeep from "lodash.clonedeep";
import { distBetweenTwoPoints, getPointInArc } from "../utils";

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
    leftHand: {
      restPosition: Vector;
      restPositionOffsetFromBody: Vector;
      restPositionAngle: number;
      distanceFromBody: number;
    };
    rightHand: {
      restPosition: Vector;
      restPositionOffsetFromBody: Vector;
      restPositionAngle: number;
      distanceFromBody: number;
    };
    leftHandReadyPosition: Vector;
    rightHandReadyPosition: Vector;
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
    body.mass = 700;
    // body.angle = -Math.PI / 2;
    Matter.Body.setAngle(body, -Math.PI / 2);
    super(id, body, 1, 1, owner, { max: 10, current: 10 });

    Matter.Composite.add(engine.world, body);

    this.acceleration = acceleration;
    this.topSpeed = topSpeed;
    if (turningSpeed) this.turningSpeed = turningSpeed;
    if (jumpHeight) this.jumpHeight = jumpHeight;
    const leftHandRestingPositionAngle = (Math.PI / 4) * -1;
    const leftHandRestingPositionDistanceFromBody = 20;
    const leftHandRestingPosition = getPointInArc(
      this.body.position,
      this.body.angle + Math.PI + leftHandRestingPositionAngle,
      leftHandRestingPositionDistanceFromBody
    );
    const rightHandRestingPositionAngle = Math.PI / 2;
    const rightHandRestingPositionDistanceFromBody = 18;
    const rightHandRestingPosition = getPointInArc(
      this.body.position,
      this.body.angle + Math.PI + rightHandRestingPositionAngle,
      rightHandRestingPositionDistanceFromBody
    );
    const gripDistance = distBetweenTwoPoints(leftHandRestingPosition, rightHandRestingPosition);
    const gripOffset = 25;
    this.spear = {
      body: Matter.Bodies.rectangle(position.x + 25, position.y - 15, 3, 110, {
        isSensor: true,
      }),
      leftHand: {
        restPosition: leftHandRestingPosition,
        restPositionOffsetFromBody: Vector.sub(this.body.position, leftHandRestingPosition),
        restPositionAngle: leftHandRestingPositionAngle,
        distanceFromBody: leftHandRestingPositionDistanceFromBody,
      },
      rightHand: {
        restPosition: rightHandRestingPosition,
        restPositionOffsetFromBody: Vector.sub(this.body.position, rightHandRestingPosition),
        restPositionAngle: rightHandRestingPositionAngle,
        distanceFromBody: rightHandRestingPositionDistanceFromBody,
      },
      rightHandReadyPosition: Vector.create(-12, 5),
      leftHandReadyPosition: Vector.create(-12, -10),
    };
    Matter.Composite.add(engine.world, this.spear.body);
    this.desiredLeftHandPosition = Matter.Constraint.create({
      bodyA: body,
      bodyB: this.spear.body,
      pointA: cloneDeep(this.spear.leftHand.restPositionOffsetFromBody),
      pointB: Vector.create(0, gripDistance / 2 - gripOffset),
      stiffness: 1,
      length: 0,
    });
    this.desiredRightHandPosition = Matter.Constraint.create({
      bodyA: body,
      bodyB: this.spear.body,
      pointA: cloneDeep(this.spear.rightHand.restPositionOffsetFromBody),
      pointB: Vector.create(0, -gripDistance / 2 - gripOffset),
      stiffness: 1,
      length: 0,
    });
    Matter.Composite.add(engine.world, this.desiredRightHandPosition);
    Matter.Composite.add(engine.world, this.desiredLeftHandPosition);
  }
}
