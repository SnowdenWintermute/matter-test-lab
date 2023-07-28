import { getPointInArc } from "@/app/utils";
import { MobileEntity } from "../entities/MobileEntity";
import drawCircle from "./drawCircle";

export default function drawRadianCompass(context: CanvasRenderingContext2D, entity: MobileEntity) {
  const { position, angle } = entity.body;
  context.lineWidth = 1;
  context.strokeStyle = "pink";
  const radius = 110;
  const textRadius = radius + 25;
  const tickMarkLength = 10;
  drawCircle(context, position, radius, "pink", false);
  let j = 0;
  for (let i = 0; i < Math.PI * 2; i += Math.PI / 16) {
    const isEven = !!(j % 2);
    if (isEven) {
      const location = getPointInArc(position, i + angle, textRadius);
      context.fillText(`${i.toFixed(1)}, ${(i - Math.PI * 2).toFixed(1)}`, location.x, location.y);
    }
    const tickMarkLocation = getPointInArc(position, i + angle, radius);
    context.beginPath();
    context.moveTo(tickMarkLocation.x, tickMarkLocation.y);
    const tickMarkEnd = getPointInArc(position, i + angle, radius - (isEven ? tickMarkLength : tickMarkLength / 2));
    context.lineTo(tickMarkEnd.x, tickMarkEnd.y);
    context.stroke();
    j += 1;
  }
}
