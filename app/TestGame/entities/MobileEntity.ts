import Matter, { Body, Vector } from "matter-js";
import { distBetweenTwoPoints, getPointInArc } from "../../utils";
import { Entity } from "./Entity";
import { Holdable } from "../holdables/Holdable";
import { PointRelativeToBody } from "../holdables/PointRelativeToBody";
import moveGripTowardPosition from "../moveGripTowardPosition";
import { CombatMoveExecutionState, EntityStance } from "../enums";

function createGripPosition(
  engine: Matter.Engine,
  body: Body,
  holdable: Holdable,
  gripPositionBodyOffset: Vector,
  holdableOffset = 0,
  options: { stiffness: number; length: number } = { stiffness: 1, length: 0 }
) {
  const gripPosition = Matter.Constraint.create({
    bodyA: body,
    bodyB: holdable.body,
    pointA: gripPositionBodyOffset,
    pointB: { x: 0, y: holdableOffset },
    stiffness: options.stiffness,
    length: options.length,
  });
  Matter.Composite.add(engine.world, gripPosition);
  return gripPosition;
}

export class MobileEntity extends Entity {
  targetAngle = 0;
  acceleration = 0.001;
  reverseAccelerationModifier = 0.4;
  sidewaysAccelerationModifier = 0.6;
  topSpeed: number = 10;
  turningSpeed = 0.12;
  jumpHeight = 20;
  jumpStrength = 1;
  handSpeed = 8;
  jumping = false;
  mainHand: "Left" | "Right" = "Right";
  equippedHoldables: { rightHand: Holdable | null; leftHand: Holdable | null } = { rightHand: null, leftHand: null };
  stance = EntityStance.AT_EASE;
  combatMoveExecutionState = CombatMoveExecutionState.AT_REST;
  constructor(
    id: number,
    public engine: Matter.Engine,
    body: Body,
    owner: string,
    acceleration: number = 0.01,
    topSpeed: number = 10,
    turningSpeed?: number,
    jumpHeight?: number
  ) {
    super(id, body, 1, 1, { max: 10, current: 10 }, owner);
    this.acceleration = acceleration;
    this.topSpeed = topSpeed;
    if (turningSpeed) this.turningSpeed = turningSpeed;
    if (jumpHeight) this.jumpHeight = jumpHeight;
  }

  equipHoldable(holdable: Holdable) {
    if (holdable.requiresTwoHands) {
      this.equippedHoldables.rightHand = holdable;
      this.equippedHoldables.leftHand = holdable;
    } else if (this.mainHand === "Left") this.equippedHoldables.leftHand = holdable;
    else this.equippedHoldables.rightHand = holdable;
    holdable.heldBy = this;

    if (holdable.positionOptions.rest) {
      const bodyGripPositionA = new PointRelativeToBody(holdable.positionOptions.rest.gripA, this.body, { flipped: true });
      const bodyGripPositionB = new PointRelativeToBody(holdable.positionOptions.rest.gripB, this.body, { flipped: true });
      const gripDistance = distBetweenTwoPoints(bodyGripPositionA.offsetFromBody, bodyGripPositionB.offsetFromBody);
      holdable.grips.a = createGripPosition(
        this.engine,
        this.body,
        holdable,
        bodyGripPositionA.offsetFromBody,
        -gripDistance / 2 + (holdable.positionOptions.rest.gripOffset || 0),
        { stiffness: 1, length: 0 }
      );
      // holdable.grips.a.damping = 1.1;
      holdable.grips.b = createGripPosition(
        this.engine,
        this.body,
        holdable,
        bodyGripPositionB.offsetFromBody,
        gripDistance / 2 + (holdable.positionOptions.rest.gripOffset || 0),
        { stiffness: 0.8, length: 0 }
      );
      // holdable.grips.b.damping = 1.1;
    }
  }
}
