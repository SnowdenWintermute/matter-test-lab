import { Vector } from "matter-js";
import { TestGame } from "..";
import { distBetweenTwoPoints } from "../../utils";
import { Hand, MobileEntity } from "../entities/MobileEntity";
import { Holdable } from "../holdables/Holdable";
import { OneHandedSword } from "../holdables/OneHandedSword";
import { Spear } from "../holdables/Spear";

export default function equipHoldableToEntity(game: TestGame, entity: MobileEntity, holdable: Holdable | Spear | OneHandedSword) {
  if (holdable.requiresTwoHands) {
    entity.equippedHoldables[Hand.RIGHT] = holdable;
    entity.equippedHoldables[Hand.LEFT] = holdable;
  } else if (entity.mainHand === Hand.LEFT) {
    if (!holdable.isOffHand) entity.equippedHoldables[Hand.LEFT] = holdable;
    else entity.equippedHoldables[Hand.RIGHT] = holdable;
  } else if (entity.mainHand === Hand.RIGHT) {
    if (!holdable.isOffHand) entity.equippedHoldables[Hand.RIGHT] = holdable;
    else entity.equippedHoldables[Hand.LEFT] = holdable;
  }

  holdable.heldBy = entity;
  const { restPosition, length } = holdable;
  const { body } = entity;

  const { main, support, distBetweenGripPairs, lowestPointYOffsetFromHoldableBottom, stiffnesses } = restPosition;
  if (!main) return;
  const gripsOffsetFromHoldableBottom = lowestPointYOffsetFromHoldableBottom || 0;

  const distMainLowerToUpper = distBetweenTwoPoints(main.lower, main.upper);
  holdable.grips = {
    main: {
      lower: game.createGripPosition(body, holdable, main.lower, length / 2 - gripsOffsetFromHoldableBottom, {
        stiffness: stiffnesses.main.upper,
        length: 0,
      }),
      upper: game.createGripPosition(
        body,
        holdable,
        Vector.rotateAbout(main.upper, body.angle, main.lower),
        length / 2 - distMainLowerToUpper - gripsOffsetFromHoldableBottom,
        {
          stiffness: stiffnesses.main.upper,
          length: 0,
        }
      ),
    },
  };

  if (!support || typeof distBetweenGripPairs !== "number") return;

  const distMainLowerToSupportLower = distBetweenTwoPoints(main.lower, support.lower);
  const distMainLowerToSupportUpper = distBetweenTwoPoints(main.lower, support.upper);
  holdable.grips.support = {
    lower: game.createGripPosition(
      body,
      holdable,
      Vector.rotateAbout(support.lower, body.angle, main.lower),
      length / 2 - distMainLowerToSupportLower - gripsOffsetFromHoldableBottom,
      {
        stiffness: stiffnesses.support.lower,
        length: 0,
      }
    ),
    upper: game.createGripPosition(
      body,
      holdable,
      Vector.rotateAbout(support.upper, body.angle, main.lower),
      length / 2 - distMainLowerToSupportUpper - gripsOffsetFromHoldableBottom,
      {
        stiffness: stiffnesses.support.upper,
        length: 0,
      }
    ),
  };
}
