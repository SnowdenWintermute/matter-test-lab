import { TestGame } from ".";
import { Trauma } from "./entities/Trauma";

export default function updateTraumas(game: TestGame) {
  Object.values(game.entities.experiencingTrauma).forEach((entityMeta) => {
    const entity = game.entities.playerControlled[entityMeta.id];
    Object.values(entity.developingTraumas).forEach((trauma) => {
      const source = game.entities.holdable[trauma.sourceId];
      const differenceCurrAngleToOriginal = trauma.originalSourceAngle - source.body.angle;
      const angleSign = Math.sign(differenceCurrAngleToOriginal);
      if (angleSign === -1 && differenceCurrAngleToOriginal < trauma.maxNegativeAngleChange) trauma.maxNegativeAngleChange = differenceCurrAngleToOriginal;
      else if (angleSign === 1 && differenceCurrAngleToOriginal > trauma.maxPositiveAngleChange) trauma.maxPositiveAngleChange = differenceCurrAngleToOriginal;
    });
  });
}
