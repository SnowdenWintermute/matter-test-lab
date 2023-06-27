import { TestGame } from ".";
import { MobileEntity } from "./entities/MobileEntity";
import { Holdable } from "./holdables/Holdable";

export default function equipHoldableToEntity(game: TestGame, entity: MobileEntity, holdable: Holdable) {
  if (holdable.requiresTwoHands) {
    entity.equippedHoldables.rightHand = holdable;
    entity.equippedHoldables.leftHand = holdable;
  } else if (entity.mainHand === "Left") entity.equippedHoldables.leftHand = holdable;
  else entity.equippedHoldables.rightHand = holdable;
  holdable.heldBy = entity;
  const { positionOptions, length } = holdable;
  const { body } = entity;

  if (positionOptions.rest) {
    const { main, support, lowestGripPoint, distBetweenGripPairs, lowestPointYOffsetFromHoldableBottom } = positionOptions.rest;
    // let holdableYOffset = 0
    holdable.grips = {
      main: {
        lower: game.createGripPosition(body, holdable, main.lower, lowestGripPoint.y),
        upper: game.createGripPosition(body, holdable, main.upper, main.upper.y),
      },
    };
    if (support && distBetweenGripPairs) {
      holdable.grips.support = {
        lower: game.createGripPosition(body, holdable, support.lower, support.lower.y),
        upper: game.createGripPosition(body, holdable, support.upper, support.upper.y),
      };
    }
  }
}
