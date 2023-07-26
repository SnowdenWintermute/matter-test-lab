import { MobileEntity } from "../entities/MobileEntity";
import { TestGame } from "..";

export default function drawEntityDebugText(context: CanvasRenderingContext2D, entity: MobileEntity, game: TestGame) {
  const { position, angle } = entity.body;
  const holdable = entity.equippedHoldables.rightHand;
  if (!holdable) return;

  const text = [`CLICKS QUEUED: ${game.mouseState.clicksQueued.left}`];
  const margin = 18;
  context.fillStyle = "pink";
  context.textAlign = "center";
  text.forEach((string, i) => {
    context.fillText(string, position.x, position.y + 55 + i * margin);
  });
}
