import { Entity } from "../entities/Entity";
import { MobileEntity } from "../entities/MobileEntity";

export default function drawHP(context: CanvasRenderingContext2D, entity: MobileEntity | Entity) {
  const { hp, body } = entity;
  const { position, angle } = body;
  const { x, y } = position;
  const width = 70;
  const height = 5;
  const yOffset = 10;
  const hpPercentRemaining = hp.current / hp.max;
  context.translate(x, y);
  context.rotate(angle);
  context.translate(-x, -y);
  context.fillStyle = "red";
  context.fillRect(x - height - yOffset, y - width / 2 + width * hpPercentRemaining, height, width * (1 - hpPercentRemaining));
  context.fillStyle = "green";
  context.fillRect(x - height - yOffset, y - width / 2, height, width * hpPercentRemaining);
  context.setTransform(1, 0, 0, 1, 0, 0);
}
