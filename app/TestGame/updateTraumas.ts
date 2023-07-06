import Matter, { Vector } from "matter-js";
import { TestGame } from ".";
import { bucketAngle, getNormalizedAngleDiff } from "../utils";
import closestDistanceToPolygon from "../utils/closestDistanceToPolygon";
import convexPolygonOverlapArea from "../utils/convexPolygonOverlapArea";
import { Trauma, numberOfAngleBuckets } from "./entities/Trauma";
import { Holdable } from "./holdables/Holdable";

export default function updateTraumas(game: TestGame) {
  Object.values(game.entities.experiencingTrauma).forEach((entityMeta) => {
    const entity = game.entities.playerControlled[entityMeta.id];
    Object.values(entity.developingTraumas).forEach((trauma) => {
      const source = game.entities.holdable[trauma.sourceId];
      // get the diff between entity and source angles
      const angleDiffBetweenEntityAndSource = entity.body.angle - source.body.angle;
      const angleBucket = bucketAngle(angleDiffBetweenEntityAndSource, numberOfAngleBuckets);
      const newOverlap = convexPolygonOverlapArea(source.body.vertices, entity.body.vertices);
      trauma.currentOverlap = newOverlap;
      // check if a bucket exists which would include that angle diff
      // if not, create it and record the highest overlap at that angle diff
      let increaseInOverlap;
      if (!trauma.overlapsBucketedByAngleDiffs[angleBucket]) {
        trauma.overlapsBucketedByAngleDiffs[angleBucket] = newOverlap;
        increaseInOverlap = newOverlap;
        // else, check if current overlap is greater than last recorded overlap in the bucket and calculate damage based on difference in overlap
      } else if (newOverlap > trauma.overlapsBucketedByAngleDiffs[angleBucket]) {
        increaseInOverlap = newOverlap - trauma.overlapsBucketedByAngleDiffs[angleBucket];
        trauma.overlapsBucketedByAngleDiffs[angleBucket] = newOverlap;
      }

      const currentDistToCenter = closestDistanceToPolygon(source.body.vertices, entity.body.position);
      trauma.currentDistToCenter = currentDistToCenter;
      // adjust speed of entity holding source
      const { heldBy } = source;
      if (heldBy) {
        const MAX_OVERLAP = 222;
        const percentOfMaxOverlap = trauma.currentOverlap / MAX_OVERLAP;
        const resistance = Math.max(1 - percentOfMaxOverlap, 0.1);
        heldBy.turningSpeed.current = heldBy.turningSpeed.base * resistance;
        heldBy.handSpeed.current = heldBy.handSpeed.base * (Math.max(resistance * 2), 1);
        heldBy.acceleration.current = heldBy.acceleration.base * resistance;
      }

      if (entity.hp.current > 0 && increaseInOverlap) {
        let damage = increaseInOverlap * 0.01;
        if (currentDistToCenter <= entity.weakpoint.radius) {
          const damageMultiplier = entity.weakpoint.radius - currentDistToCenter;
          damage *= Math.max(damageMultiplier / 5, 1);
        }
        entity.hp.current -= damage;
        if (entity.hp.current < 0) entity.hp.current = 0;
        trauma.totalDamage += damage;
        const { velocity } = source.body;
        Matter.Body.applyForce(entity.body, entity.body.position, Vector.mult(velocity, 0.0005));
      }
    });
  });
}
