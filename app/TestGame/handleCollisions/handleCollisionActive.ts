import { TestGame } from "..";
import { EntityCategory } from "../enums";
import determineHoldableCollisionPairEntities from "./determineHoldableCollisionPairEntities";

export default function handleCollisionActive(event: Matter.IEventCollision<Matter.Engine>, game: TestGame) {
  // var pairs = event.pairs;
  // for (var i = 0, j = pairs.length; i != j; i += 1) {
  //   const pair = pairs[i];
  //   const collisionEntities = determineHoldableCollisionPairEntities(pair, game, "active");
  //   // console.log(collisionEntities);
  //   if (!collisionEntities) return;
  //   console.log("o");
  //   const { holdable, heldBy, otherEntityId, otherEntityCategory } = collisionEntities;
  //   holdable.isColliding = false;
  //   if (otherEntityCategory !== EntityCategory.PLAYER_CONTROLLED) return;
  //   console.log("ay");
  //   if (otherEntityCategory === EntityCategory.PLAYER_CONTROLLED) {
  //     console.log(pair);
  //   }
  // }
}
