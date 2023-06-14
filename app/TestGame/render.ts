import { TestGame } from "../TestGame";

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
    context.fillStyle = "pink";
    context.textAlign = "center";
    context.fillText(
      `Target angle: ${game.inputState.targetAngle?.toFixed(2)}`,
      x,
      y + 55
    );
    const bodyAngleMod = entity.body.angle % (Math.PI * 2);
    context.fillText(`Angle mod 2PI: ${bodyAngleMod.toFixed(2)}`, x, y + 75);
    if (game.inputState.targetAngle) {
      const angleDifference =
        game.inputState.targetAngle - Math.abs(bodyAngleMod);
      const angleDifference2 = bodyAngleMod - game.inputState.targetAngle;

      context.fillText(`Diff: ${angleDifference.toFixed(2)}`, x, y + 95);
      context.fillText(`Diff2: ${angleDifference2.toFixed(2)}`, x, y + 115);
    }
  });
}
