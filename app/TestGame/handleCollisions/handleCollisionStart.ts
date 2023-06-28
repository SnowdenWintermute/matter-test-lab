import { TestGame } from "../";
import { EntityCategory } from "../enums";
import determineHoldableCollisionPairEntities from "./determineHoldableCollisionPairEntities";
import loosenGrips from "./loosenGrips";

export default function handleCollisionStart(event: Matter.IEventCollision<Matter.Engine>, game: TestGame) {
  var pairs = event.pairs;
  for (var i = 0, j = pairs.length; i != j; i += 1) {
    const pair = pairs[i];
    const collisionEntities = determineHoldableCollisionPairEntities(pair, game);
    if (!collisionEntities) return;
    const { holdable, heldBy, otherEntityId, otherEntityCategory } = collisionEntities;
    holdable.isColliding = true;
    if (otherEntityCategory !== EntityCategory.PLAYER_CONTROLLED) {
      // later calc durability loss, weapon breaks
      pair.isSensor = false;
      loosenGrips(holdable);
      return;
    }
    if (otherEntityCategory === EntityCategory.PLAYER_CONTROLLED) {
      heldBy.turningSpeed.current = 0.02;
      const entityToDamage = game.entities.playerControlled[otherEntityId];
      if (entityToDamage.hp.current > 0) entityToDamage.hp.current -= 1;
      console.log("damaging entity ", entityToDamage.id);
    }
    // pair.isSensor = false;
  }
}
