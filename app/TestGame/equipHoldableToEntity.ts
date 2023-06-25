import { TestGame } from ".";
import { distBetweenTwoPoints } from "../utils";
import { MobileEntity } from "./entities/MobileEntity";
import { Holdable } from "./holdables/Holdable";
import { PointRelativeToBody } from "./holdables/PointRelativeToBody";

export default function equipHoldableToEntity(game: TestGame, entity: MobileEntity, holdable: Holdable) {
  if (holdable.requiresTwoHands) {
    entity.equippedHoldables.rightHand = holdable;
    entity.equippedHoldables.leftHand = holdable;
  } else if (entity.mainHand === "Left") entity.equippedHoldables.leftHand = holdable;
  else entity.equippedHoldables.rightHand = holdable;
  holdable.heldBy = entity;

  if (holdable.positionOptions.rest) {
    const bodyGripPositionA = new PointRelativeToBody(holdable.positionOptions.rest.gripA, entity.body, { flipped: true });
    const bodyGripPositionB = new PointRelativeToBody(holdable.positionOptions.rest.gripB, entity.body, { flipped: true });
    const bodyGripPositionC = new PointRelativeToBody(holdable.positionOptions.rest.gripC!, entity.body, { flipped: true });
    const gripDistance = distBetweenTwoPoints(bodyGripPositionA.offsetFromBody, bodyGripPositionB.offsetFromBody);
    holdable.grips.a = game.createGripPosition(
      entity.body,
      holdable,
      bodyGripPositionA.offsetFromBody,
      -gripDistance / 2 + (holdable.positionOptions.rest.gripOffset || 0),
      { stiffness: 0.4, length: 0 }
    );
    holdable.grips.b = game.createGripPosition(
      entity.body,
      holdable,
      bodyGripPositionB.offsetFromBody,
      gripDistance / 2 + (holdable.positionOptions.rest.gripOffset || 0),
      { stiffness: 0.4, length: 0 }
    );
    holdable.grips.c = game.createGripPosition(
      entity.body,
      holdable,
      bodyGripPositionC.offsetFromBody,
      gripDistance / 2 + (holdable.positionOptions.rest.gripOffset || 0),
      { stiffness: 1, length: 0 }
    );
  }
}
