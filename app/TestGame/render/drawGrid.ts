export default function drawGrid(context: CanvasRenderingContext2D, canvasSize: { width: number; height: number }, squareSize: number) {
  context.lineWidth = 1;
  context.strokeStyle = "grey";
  for (let i = 0; i < canvasSize.width / squareSize; i += 1) {
    context.beginPath();
    context.moveTo(i * squareSize + squareSize, 0);
    context.lineTo(i * squareSize + squareSize, canvasSize.height);
    context.stroke();
  }
  for (let i = 0; i < canvasSize.height / squareSize; i += 1) {
    context.beginPath();
    context.moveTo(0, i * squareSize + squareSize);
    context.lineTo(canvasSize.width, i * squareSize + squareSize);
    context.stroke();
  }

  for (let i = 0; i < canvasSize.height / squareSize; i += 1) {
    context.beginPath();
    context.moveTo(0, i * squareSize + squareSize);
    context.lineTo(i * squareSize + squareSize, canvasSize.width);
    context.stroke();
  }
  // for (let i = 0; i < canvasSize.height / squareSize; i += 1) {
  //   context.beginPath();
  //   context.moveTo(i * squareSize + squareSize, 0);
  //   context.lineTo(canvasSize.width, i * squareSize + squareSize);
  //   context.stroke();
  // }
}
