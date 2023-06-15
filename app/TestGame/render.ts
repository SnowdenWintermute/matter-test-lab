import { TestGame } from "../TestGame";
import { normalizeRadians } from "./handlePlayerInputs";

export default function render(
  context: CanvasRenderingContext2D,
  game: TestGame,
  canvasSize: { width: number; height: number }
) {
  context.clearRect(0, 0, canvasSize.width, canvasSize.height);
  Object.values(game.entities.playerControlled).forEach((entity) => {
    context.fillStyle = "#9ba8b8";
    context.beginPath();
    entity.body.vertices.forEach((vertex, i) => {
      if (i === 0) context.moveTo(vertex.x, vertex.y);
      else context.lineTo(vertex.x, vertex.y);
    });
    context.closePath();
    context.fill();
    context.beginPath();
    const { x, y } = entity.body.position;
    context.strokeStyle = "#a52026";
    context.lineWidth = 4;
    context.moveTo(x, y);
    context.lineTo(
      x + 40 * Math.cos(entity.body.angle),
      y + 40 * Math.sin(entity.body.angle)
    );
    context.stroke();

    context.beginPath();
    context.strokeStyle = "#028a7e";
    context.lineWidth = 4;
    context.moveTo(x, y);
    context.lineTo(
      x + 40 * Math.cos(entity.targetAngle),
      y + 40 * Math.sin(entity.targetAngle)
    );
    context.stroke();

    context.fillStyle = "pink";
    context.textAlign = "center";
    const normalizedTarget = normalizeRadians(game.inputState.targetAngle!);
    if (normalizedTarget) {
      context.fillText(
        `Normalized target angle : ${normalizedTarget.toFixed(2)}`,
        x,
        y + 55
      );
    }
    const normalizedAngle = normalizeRadians(entity.body.angle);
    context.fillText(
      `normalized angle: ${normalizedAngle.toFixed(2)}`,
      x,
      y + 75
    );

    const difference = normalizedAngle - normalizedTarget;
    context.fillText(`difference: ${difference.toFixed(2)}`, x, y + 95);
  });
}
