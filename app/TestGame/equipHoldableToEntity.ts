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
  const { positionOptions, grips } = holdable;
  const { body } = entity;

  if (positionOptions.rest) {
    const gripPointsRelativeToCurrentBodyPosition: {
      main: { upper: PointRelativeToBody; lower: PointRelativeToBody };
      support?: { upper: PointRelativeToBody; lower: PointRelativeToBody };
    } = {
      main: {
        upper: new PointRelativeToBody(positionOptions.rest.main.upper, body, { flipped: true }),
        lower: new PointRelativeToBody(positionOptions.rest.main.upper, body, { flipped: true }),
      },
    };
    if (positionOptions.rest.support) {
      gripPointsRelativeToCurrentBodyPosition.support = {
        upper: new PointRelativeToBody(positionOptions.rest.support.upper, body, { flipped: true }),
        lower: new PointRelativeToBody(positionOptions.rest.support.upper, body, { flipped: true }),
      };
    }

    const { main, support } = gripPointsRelativeToCurrentBodyPosition;

    const gripDistance = distBetweenTwoPoints(bodyGripPositionA.offsetFromBody, bodyGripPositionB.offsetFromBody);

    holdable.grips = {
      mainHand: {
        upper: game.createGripPosition(body, holdable, mainHand.upper),
        lower: game.createGripPosition(body, holdable, mainHand.lower),
      },
    };
    grips.mainHand.upper = game.createGripPosition(
      entity.body,
      holdable,
      bodyGripPositionA.offsetFromBody,
      -gripDistance / 2 + (holdable.positionOptions.rest.gripOffset || 0),
      { stiffness: 0.9, length: 0 }
    );
    grips.b = game.createGripPosition(
      entity.body,
      holdable,
      bodyGripPositionB.offsetFromBody,
      gripDistance / 2 + (holdable.positionOptions.rest.gripOffset || 0),
      { stiffness: 0.9, length: 0 }
    );
    grips.c = game.createGripPosition(
      entity.body,
      holdable,
      bodyGripPositionC.offsetFromBody,
      -gripDistance / 2 + (holdable.positionOptions.rest.gripOffset || 0),
      { stiffness: 1, length: 0 }
    );
  }
}
