import Matter, { Vector } from "matter-js";
import cloneDeep from "lodash.clonedeep";
import { angleBetweenPoints, distBetweenTwoPoints, getPointInArc } from "../../utils";
import { Entity } from "./Entity";
import { HandPosition } from "./HandPosition";

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
  handSpeed = 2;
  jumping = false;
  spear: {
    body: Matter.Body;
    leftHandRestPosition: HandPosition;
    rightHandRestPosition: HandPosition;
    leftHandReadyPosition: HandPosition;
    rightHandReadyPosition: HandPosition;
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
    body.mass = 500;
    const startingAngle = -Math.PI / 2;
    Matter.Body.setAngle(body, startingAngle);
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

    const leftHandReadyPositionOffset = Vector.create(12, 10);
    const leftHandReadyPositionAngle = angleBetweenPoints(Vector.create(0, 0), leftHandReadyPositionOffset);
    const leftHandReadyPositionDistanceFromBody = distBetweenTwoPoints(Vector.create(0, 0), leftHandReadyPositionOffset);
    const leftHandReadyPosition = getPointInArc(
      this.body.position,
      this.body.angle + Math.PI + leftHandReadyPositionAngle,
      leftHandReadyPositionDistanceFromBody
    );

    const rightHandReadyPositionOffset = Vector.create(-12, 10);
    const rightHandReadyPositionAngle = angleBetweenPoints(Vector.create(0, 0), rightHandReadyPositionOffset);
    const rightHandReadyPositionDistanceFromBody = distBetweenTwoPoints(Vector.create(0, 0), rightHandReadyPositionOffset);
    const rightHandReadyPosition = getPointInArc(
      this.body.position,
      this.body.angle + Math.PI + rightHandReadyPositionAngle,
      rightHandReadyPositionDistanceFromBody
    );

    this.spear = {
      body: Matter.Bodies.rectangle(position.x + 25, position.y - 15, 3, 110, {
        isSensor: true,
      }),
      leftHandRestPosition: new HandPosition(
        leftHandRestingPosition,
        Vector.sub(this.body.position, leftHandRestingPosition),
        leftHandRestingPositionAngle,
        leftHandRestingPositionDistanceFromBody
      ),
      rightHandRestPosition: new HandPosition(
        rightHandRestingPosition,
        Vector.sub(this.body.position, rightHandRestingPosition),
        rightHandRestingPositionAngle,
        rightHandRestingPositionDistanceFromBody
      ),
      leftHandReadyPosition: new HandPosition(
        leftHandReadyPosition,
        leftHandReadyPositionOffset,
        leftHandReadyPositionAngle,
        leftHandReadyPositionDistanceFromBody
      ),
      rightHandReadyPosition: new HandPosition(
        rightHandReadyPosition,
        rightHandReadyPositionOffset,
        rightHandReadyPositionAngle,
        rightHandReadyPositionDistanceFromBody
      ),
    };

    Matter.Composite.add(engine.world, this.spear.body);
    this.desiredLeftHandPosition = Matter.Constraint.create({
      bodyA: body,
      bodyB: this.spear.body,
      pointA: cloneDeep(this.spear.leftHandRestPosition.offset),
      pointB: Vector.create(0, gripDistance / 2 - gripOffset),
      stiffness: 1,
      length: 0,
    });
    this.desiredRightHandPosition = Matter.Constraint.create({
      bodyA: body,
      bodyB: this.spear.body,
      pointA: cloneDeep(this.spear.rightHandRestPosition.offset),
      pointB: Vector.create(0, -gripDistance / 2 - gripOffset),
      stiffness: 1,
      length: 0,
    });
    Matter.Composite.add(engine.world, this.desiredRightHandPosition);
    Matter.Composite.add(engine.world, this.desiredLeftHandPosition);
  }
}
