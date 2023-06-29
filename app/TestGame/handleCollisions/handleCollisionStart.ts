import { getNormalizedAngleDiff, getSpeedOfApproach } from "@/app/utils";
import { TestGame } from "../";
import { EntityCategory } from "../enums";
import determineHoldableCollisionPairEntities from "./determineHoldableCollisionPairEntities";
import loosenGrips from "./loosenGrips";
import { Trauma } from "../entities/Trauma";
import closestDistanceToPolygon from "@/app/utils/closestDistanceToPolygon";
import convexPolygonOverlapArea from "@/app/utils/convexPolygonOverlapArea";

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
      // pair.isSensor = false;
      const entityStruck = game.entities.playerControlled[otherEntityId];
      const speedOfApproach = getSpeedOfApproach(holdable.body, entityStruck.body);
      // if (Math.abs(speedOfApproach) > 6) {
      pair.isSensor = true;
      heldBy.turningSpeed.current = 0.02;
      if (entityStruck.hp.current > 0) {
        if (!entityStruck.developingTraumas[holdable.id]) {
          const newTrauma = new Trauma(
            { id: entityStruck.id, category: EntityCategory.PLAYER_CONTROLLED },
            holdable.id,
            closestDistanceToPolygon(holdable.body.vertices, entityStruck.body.position),
            getNormalizedAngleDiff(holdable.body.angle, entityStruck.body.angle),
            convexPolygonOverlapArea(holdable.body.vertices, entityStruck.body.vertices)
          );
          entityStruck.developingTraumas[holdable.id] = newTrauma;
          game.entities.experiencingTrauma[entityStruck.id] = { id: entityStruck.id, category: EntityCategory.PLAYER_CONTROLLED };
        }
        // }
        return;
      }
    }
    // pair.isSensor = false;
  }
}
