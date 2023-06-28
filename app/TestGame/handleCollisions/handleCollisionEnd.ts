import { TestGame } from "..";
import { EntityCategory } from "../enums";
import determineHoldableCollisionPairEntities from "./determineHoldableCollisionPairEntities";

export default function handleCollisionEnd(event: Matter.IEventCollision<Matter.Engine>, game: TestGame) {
  var pairs = event.pairs;
  for (var i = 0, j = pairs.length; i != j; i += 1) {
    const pair = pairs[i];
    const collisionEntities = determineHoldableCollisionPairEntities(pair, game);
    if (!collisionEntities) return;
    const { holdable, heldBy, otherEntityId, otherEntityCategory } = collisionEntities;
    if (otherEntityCategory === EntityCategory.PLAYER_CONTROLLED) {
      heldBy.turningSpeed.current = heldBy.turningSpeed.base;
    }
  }
}
