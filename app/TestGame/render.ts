import { TestGame } from "../TestGame";

export default function render(
  context: CanvasRenderingContext2D,
  game: TestGame,
  canvasSize: { width: number; height: number }
) {
  context.clearRect(0, 0, canvasSize.width, canvasSize.height);
  Object.values(game.entities.playerControlled).forEach((entity) => {
    context.fillStyle = "#234890";
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
  });
}
