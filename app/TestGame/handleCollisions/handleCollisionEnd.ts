import { TestGame } from "..";
import { EntityCategory } from "../enums";
import determineHoldableCollisionPairEntities from "./determineHoldableCollisionPairEntities";
import tightenGripsAfterDelay from "./tightenGripsAfterDelay";

export default function handleCollisionEnd(event: Matter.IEventCollision<Matter.Engine>, game: TestGame) {
  var pairs = event.pairs;
  for (var i = 0, j = pairs.length; i != j; i += 1) {
    const pair = pairs[i];
    const collisionEntities = determineHoldableCollisionPairEntities(pair, game);
    if (!collisionEntities) return;
    const { holdable, heldBy, otherEntityId, otherEntityCategory } = collisionEntities;
    holdable.isColliding = false;
    if (otherEntityCategory !== EntityCategory.PLAYER_CONTROLLED) {
      tightenGripsAfterDelay(holdable);
      return;
    }
    if (otherEntityCategory === EntityCategory.PLAYER_CONTROLLED) {
      heldBy.turningSpeed.current = heldBy.turningSpeed.base;
      const entityStruck = game.entities.playerControlled[otherEntityId];
      delete entityStruck.developingTraumas[holdable.id];
      delete game.entities.experiencingTrauma[entityStruck.id];
    }
  }
}
