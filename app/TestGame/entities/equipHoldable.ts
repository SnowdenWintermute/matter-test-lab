import { Holdable } from "../holdables/Holdable";
import { MobileEntity } from "./MobileEntity";
import { distBetweenTwoPoints } from "@/app/utils";
import { PointRelativeToBody } from "../holdables/PointRelativeToBody";
import { TestGame } from "..";

export default function equipHoldable(game: TestGame, entity: MobileEntity, holdable: Holdable) {
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
      entity.engine,
      entity.body,
      holdable,
      bodyGripPositionA.offsetFromBody,
      -gripDistance / 2 + (holdable.positionOptions.rest.gripOffset || 0),
      { stiffness: 0.4, length: 0 }
    );
    holdable.grips.b = game.createGripPosition(
      entity.engine,
      entity.body,
      holdable,
      bodyGripPositionB.offsetFromBody,
      gripDistance / 2 + (holdable.positionOptions.rest.gripOffset || 0),
      { stiffness: 0.4, length: 0 }
    );
    holdable.grips.c = game.createGripPosition(
      entity.engine,
      entity.body,
      holdable,
      bodyGripPositionC.offsetFromBody,
      gripDistance / 2 + (holdable.positionOptions.rest.gripOffset || 0),
      { stiffness: 1, length: 0 }
    );
  }
}
