import { angleBetweenPoints, distBetweenTwoPoints, getPointInArc, movePointTowards, normalizeRadians, roundedStringifiedVector } from "@/app/utils";
import { MobileEntity } from "../entities/MobileEntity";
import { Vector } from "matter-js";
import { PointRelativeToBody } from "../holdables/PointRelativeToBody";

export default function drawEntityDebugText(context: CanvasRenderingContext2D, entity: MobileEntity) {
  const { position, angle } = entity.body;
  context.fillStyle = "pink";
  context.textAlign = "center";
  const spear = entity.equippedHoldables.rightHand;
  if (!spear) return;

  const { grips } = spear;

  const currentHoldableAngle = spear.body.angle;
  const currentHoldableForce = roundedStringifiedVector(spear.body.force);
  const currentTraumas = entity.developingTraumas;
  // get the distance between the gripAs

  const text = [`TRAUMAS: ${JSON.stringify(currentTraumas)}`];
  const margin = 18;
  text.forEach((string, i) => {
    context.fillText(string, position.x, position.y + 55 + i * margin);
  });
}
