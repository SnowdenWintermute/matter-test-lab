import { TestGame } from ".";
import { distBetweenTwoPoints } from "../utils";
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
    const { main, support, distBetweenGripPairs, lowestPointYOffsetFromHoldableBottom } = positionOptions.rest;
    const gripsOffsetFromHoldableBottom = lowestPointYOffsetFromHoldableBottom || 0;
    const distMainLowerToUpper = distBetweenTwoPoints(main.lower, main.upper);
    holdable.grips = {
      main: {
        lower: game.createGripPosition(body, holdable, main.lower, length / 2 - gripsOffsetFromHoldableBottom),
        upper: game.createGripPosition(body, holdable, main.upper, length / 2 - distMainLowerToUpper - gripsOffsetFromHoldableBottom, {
          stiffness: 0.8,
          length: 0,
        }),
      },
    };
    if (support && distBetweenGripPairs) {
      const distMainLowerToSupportLower = distBetweenTwoPoints(main.lower, support.lower);
      const distMainLowerToSupportUpper = distBetweenTwoPoints(main.lower, support.upper);
      holdable.grips.support = {
        lower: game.createGripPosition(body, holdable, support.lower, length / 2 - distMainLowerToSupportLower - gripsOffsetFromHoldableBottom, {
          stiffness: 0.7,
          length: 3,
        }),
        upper: game.createGripPosition(body, holdable, support.upper, length / 2 - distMainLowerToSupportUpper - gripsOffsetFromHoldableBottom, {
          stiffness: 0.5,
          length: 1,
        }),
      };
    }
  }
}
