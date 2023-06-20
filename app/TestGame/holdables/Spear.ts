import Matter, { Vector } from "matter-js";
import { Holdable, HoldableType } from "./Holdable";
import { getPointInArc } from "@/app/utils";
import { MobileEntity } from "../entities/MobileEntity";
import { PointRelativeToBody } from "./PointRelativeToBody";

export class Spear extends Holdable {
  constructor(position: Vector) {
    const body = Matter.Bodies.rectangle(position.x + 25, position.y - 15, 3, 110, {
      isSensor: true,
    });

    const leftHandRestingPositionAngle = (Math.PI / 4) * -1;
    const leftHandRestingPositionDistanceFromBody = 20;
    const leftHandRestingPosition = (entity: MobileEntity) =>
      getPointInArc(entity.body.position, entity.body.angle + Math.PI + leftHandRestingPositionAngle, leftHandRestingPositionDistanceFromBody);
    // const leftHandConstraintLocation = new PointRelativeToBody()
    const rightHandRestingPositionAngle = Math.PI / 2;
    const rightHandRestingPositionDistanceFromBody = 18;
    const rightHandRestingPosition = (entity: MobileEntity) =>
      getPointInArc(entity.body.position, entity.body.angle + Math.PI + rightHandRestingPositionAngle, rightHandRestingPositionDistanceFromBody);
    super(1, HoldableType.SPEAR, body, {});
  }
  // Rest
  // Ready
  // Forward Strike
  // Left Strike
  // Right Strike
  // Left Guard
  // Right Guard
  // Center Guard
  // spear: {
  //   body: Matter.Body;
  //   leftHandRestPosition: HandPosition;
  //   rightHandRestPosition: HandPosition;
  //   leftHandReadyPosition: HandPosition;
  //   rightHandReadyPosition: HandPosition;
  // };
  // const leftHandRestingPositionAngle = (Math.PI / 4) * -1;
  // const leftHandRestingPositionDistanceFromBody = 20;
  // const leftHandRestingPosition = getPointInArc(
  //   this.body.position,
  //   this.body.angle + Math.PI + leftHandRestingPositionAngle,
  //   leftHandRestingPositionDistanceFromBody
  // );
  // const rightHandRestingPositionAngle = Math.PI / 2;
  // const rightHandRestingPositionDistanceFromBody = 18;
  // const rightHandRestingPosition = getPointInArc(
  //   this.body.position,
  //   this.body.angle + Math.PI + rightHandRestingPositionAngle,
  //   rightHandRestingPositionDistanceFromBody
  // );
  // const gripDistance = distBetweenTwoPoints(leftHandRestingPosition, rightHandRestingPosition);
  // const gripOffset = 25;
  // const leftHandReadyPositionOffset = Vector.create(12, 10);
  // const leftHandReadyPositionAngle = angleBetweenPoints(Vector.create(0, 0), leftHandReadyPositionOffset);
  // const leftHandReadyPositionDistanceFromBody = distBetweenTwoPoints(Vector.create(0, 0), leftHandReadyPositionOffset);
  // const leftHandReadyPosition = getPointInArc(
  //   this.body.position,
  //   this.body.angle + Math.PI + leftHandReadyPositionAngle,
  //   leftHandReadyPositionDistanceFromBody
  // );
  // const rightHandReadyPositionOffset = Vector.create(-12, 10);
  // const rightHandReadyPositionAngle = angleBetweenPoints(Vector.create(0, 0), rightHandReadyPositionOffset);
  // const rightHandReadyPositionDistanceFromBody = distBetweenTwoPoints(Vector.create(0, 0), rightHandReadyPositionOffset);
  // const rightHandReadyPosition = getPointInArc(
  //   this.body.position,
  //   this.body.angle + Math.PI + rightHandReadyPositionAngle,
  //   rightHandReadyPositionDistanceFromBody
  // );
  // this.spear = {
  //   body: Matter.Bodies.rectangle(position.x + 25, position.y - 15, 3, 110, {
  //     isSensor: true,
  //   }),
  //   leftHandRestPosition: new HandPosition(
  //     leftHandRestingPosition,
  //     Vector.sub(this.body.position, leftHandRestingPosition),
  //     leftHandRestingPositionAngle,
  //     leftHandRestingPositionDistanceFromBody
  //   ),
  //   rightHandRestPosition: new HandPosition(
  //     rightHandRestingPosition,
  //     Vector.sub(this.body.position, rightHandRestingPosition),
  //     rightHandRestingPositionAngle,
  //     rightHandRestingPositionDistanceFromBody
  //   ),
  //   leftHandReadyPosition: new HandPosition(
  //     leftHandReadyPosition,
  //     leftHandReadyPositionOffset,
  //     leftHandReadyPositionAngle,
  //     leftHandReadyPositionDistanceFromBody
  //   ),
  //   rightHandReadyPosition: new HandPosition(
  //     rightHandReadyPosition,
  //     rightHandReadyPositionOffset,
  //     rightHandReadyPositionAngle,
  //     rightHandReadyPositionDistanceFromBody
  //   ),
  // };
  // this.spear = {
  //   body: Matter.Bodies.rectangle(position.x + 25, position.y - 15, 3, 110, {
  //     isSensor: true,
  //   }),
  //   leftHandRestPosition: new HandPosition(
  //     leftHandRestingPosition,
  //     Vector.sub(this.body.position, leftHandRestingPosition),
  //     leftHandRestingPositionAngle,
  //     leftHandRestingPositionDistanceFromBody
  //   ),
  //   rightHandRestPosition: new HandPosition(
  //     rightHandRestingPosition,
  //     Vector.sub(this.body.position, rightHandRestingPosition),
  //     rightHandRestingPositionAngle,
  //     rightHandRestingPositionDistanceFromBody
  //   ),
  //   leftHandReadyPosition: new HandPosition(
  //     leftHandReadyPosition,
  //     leftHandReadyPositionOffset,
  //     leftHandReadyPositionAngle,
  //     leftHandReadyPositionDistanceFromBody
  //   ),
  //   rightHandReadyPosition: new HandPosition(
  //     rightHandReadyPosition,
  //     rightHandReadyPositionOffset,
  //     rightHandReadyPositionAngle,
  //     rightHandReadyPositionDistanceFromBody
  //   ),
  // };
  // Matter.Composite.add(engine.world, this.spear.body);
  // this.desiredLeftHandPosition = Matter.Constraint.create({
  //   bodyA: body,
  //   bodyB: this.spear.body,
  //   pointA: cloneDeep(this.spear.leftHandRestPosition.offset),
  //   pointB: Vector.create(0, gripDistance / 2 - gripOffset),
  //   stiffness: 1,
  //   length: 0,
  // });
  // this.desiredRightHandPosition = Matter.Constraint.create({
  //   bodyA: body,
  //   bodyB: this.spear.body,
  //   pointA: cloneDeep(this.spear.rightHandRestPosition.offset),
  //   pointB: Vector.create(0, -gripDistance / 2 - gripOffset),
  //   stiffness: 1,
  //   length: 0,
  // });
  // Matter.Composite.add(engine.world, this.desiredRightHandPosition);
  // Matter.Composite.add(engine.world, this.desiredLeftHandPosition);
}
