import { TestGame } from ".";
import { getNormalizedAngleDiff } from "../utils";
import closestDistanceToPolygon from "../utils/closestDistanceToPolygon";
import convexPolygonOverlapArea from "../utils/convexPolygonOverlapArea";
import { Trauma } from "./entities/Trauma";

export default function updateTraumas(game: TestGame) {
  Object.values(game.entities.experiencingTrauma).forEach((entityMeta) => {
    const entity = game.entities.playerControlled[entityMeta.id];
    Object.values(entity.developingTraumas).forEach((trauma) => {
      const source = game.entities.holdable[trauma.sourceId];
      const newDiffAnglesSourceAndEntity = getNormalizedAngleDiff(source.body.angle, entity.body.angle);
      const changeInAngle = Math.abs(trauma.currentAngleDiffSourceToEntity - newDiffAnglesSourceAndEntity);
      trauma.currentDistToCenter = closestDistanceToPolygon(source.body.vertices, entity.body.position);
      trauma.currentAngleDiffSourceToEntity = newDiffAnglesSourceAndEntity;
      trauma.currentOverlap = convexPolygonOverlapArea(source.body.vertices, entity.body.vertices);
      // const angleChangeToUse = changeInAngle < 0.01 ? 0.01 : changeInAngle;
      const damage = changeInAngle * trauma.currentOverlap;
      // console.log(trauma.currentDistToCenter.toFixed(2), changeInAngle.toFixed(2), trauma.currentOverlap.toFixed(2));
      console.log(damage);
      if (entity.hp.current > 0) entity.hp.current -= damage;
      // calc damage
    });
  });
}
