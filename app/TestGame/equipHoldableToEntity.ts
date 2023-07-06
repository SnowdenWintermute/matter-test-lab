import { TestGame } from ".";
import { distBetweenTwoPoints } from "../utils";
import { MobileEntity } from "./entities/MobileEntity";
import { Holdable } from "./holdables/Holdable";
import { OneHandedSword } from "./holdables/OneHandedSword";
import { Spear } from "./holdables/Spear";

export default function equipHoldableToEntity(game: TestGame, entity: MobileEntity, holdable: Holdable | Spear | OneHandedSword) {
  if (holdable.requiresTwoHands) {
    entity.equippedHoldables.rightHand = holdable;
    entity.equippedHoldables.leftHand = holdable;
  } else if (entity.mainHand === "Left") entity.equippedHoldables.leftHand = holdable;
  else entity.equippedHoldables.rightHand = holdable;
  holdable.heldBy = entity;
  const { positionOptions, length } = holdable;
  const { body } = entity;

  if (positionOptions.rest) {
    const { main, support, distBetweenGripPairs, lowestPointYOffsetFromHoldableBottom, stiffnesses } = positionOptions.rest;
    const gripsOffsetFromHoldableBottom = lowestPointYOffsetFromHoldableBottom || 0;
    const distMainLowerToUpper = distBetweenTwoPoints(main.lower, main.upper);
    holdable.grips = {
      main: {
        lower: game.createGripPosition(body, holdable, main.lower, length / 2 - gripsOffsetFromHoldableBottom, {
          stiffness: stiffnesses.main.upper,
          length: 0,
        }),
        upper: game.createGripPosition(body, holdable, main.upper, length / 2 - distMainLowerToUpper - gripsOffsetFromHoldableBottom, {
          stiffness: stiffnesses.main.upper,
          length: 0,
        }),
      },
    };
    if (support && distBetweenGripPairs) {
      const distMainLowerToSupportLower = distBetweenTwoPoints(main.lower, support.lower);
      const distMainLowerToSupportUpper = distBetweenTwoPoints(main.lower, support.upper);
      holdable.grips.support = {
        lower: game.createGripPosition(body, holdable, support.lower, length / 2 - distMainLowerToSupportLower - gripsOffsetFromHoldableBottom, {
          stiffness: stiffnesses.support.lower,
          length: 0,
        }),
        upper: game.createGripPosition(body, holdable, support.upper, length / 2 - distMainLowerToSupportUpper - gripsOffsetFromHoldableBottom, {
          stiffness: stiffnesses.support.upper,
          length: 0,
        }),
      };
    }
  }
}
