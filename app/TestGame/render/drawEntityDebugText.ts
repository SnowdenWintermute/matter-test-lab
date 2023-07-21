import {
  angleBetweenPoints,
  distBetweenTwoPoints,
  getAngleFromCenter,
  getPointInArc,
  movePointTowards,
  normalizeRadians,
  roundedStringifiedVector,
} from "@/app/utils";
import { MobileEntity } from "../entities/MobileEntity";
import { Vector } from "matter-js";
import { PointRelativeToBody } from "../holdables/PointRelativeToBody";
import { OneHandedSword } from "../holdables/OneHandedSword";
import { HoldableGripConstraintCreationData } from "../holdables/Holdable";
import { DamageType, MovementType } from "../entities/Attack";
import drawCircle from "./drawCircle";

export default function drawEntityDebugText(context: CanvasRenderingContext2D, entity: MobileEntity) {
  const { position, angle } = entity.body;
  const holdable = entity.equippedHoldables.rightHand;
  if (!holdable) return;

  const { grips } = holdable;
  const distBetweenGripPairMembers = 10;
  const step = {
    position: new HoldableGripConstraintCreationData({ x: 7, y: -40 }, 0, distBetweenGripPairMembers, 10, 10),
    movementType: MovementType.ARC,
    arcEndingRadius: 20,
    arcCenterOffsetFromBody: { x: 10, y: 10 },
    damageType: DamageType.SLASHING,
  };
  const { arcCenterOffsetFromBody, arcEndingRadius } = step;
  if (!holdable.grips || !arcCenterOffsetFromBody || !arcEndingRadius) return;
  const { main, support } = holdable.grips;

  const arcCenterWorldLocation = Vector.add(Vector.rotateAbout(arcCenterOffsetFromBody, angle, { x: 0, y: 0 }), position);
  drawCircle(context, arcCenterWorldLocation, 4, "blue", false);
  const gripAWorldLocation = Vector.add(position, main.lower.pointA);
  drawCircle(context, gripAWorldLocation, 7, "white", true);
  const gripDestination = getPointInArc(arcCenterWorldLocation, step.position.angle + angle, step.arcEndingRadius);
  drawCircle(context, gripDestination, 3, "red", false);

  const gripDestinationAngle = normalizeRadians(getAngleFromCenter(arcCenterWorldLocation, gripDestination));
  const currentAngle = getAngleFromCenter(arcCenterWorldLocation, gripAWorldLocation);
  // const currentAngle =
  //   Vector.dot(Vector.sub(arcCenterWorldLocation, gripDestination), Vector.sub(arcCenterWorldLocation, gripAWorldLocation)) * (Math.PI / 180.0) * -1;
  const newAngle = currentAngle;

  const currDist = distBetweenTwoPoints(arcCenterWorldLocation, gripAWorldLocation);
  const newLocation = getPointInArc(arcCenterWorldLocation, newAngle, currDist);
  drawCircle(context, newLocation, 4, "orange", false);

  const text = [
    `CREATION: ${normalizeRadians(step.position.angle + angle).toFixed(1)}`,
    `CURR: ${currentAngle.toFixed(1)}`,
    `GRIP DEST: ${gripDestinationAngle.toFixed(1)}`,
    `NEW: ${newAngle.toFixed(1)}`,
  ];
  const margin = 18;
  context.fillStyle = "pink";
  context.textAlign = "center";
  text.forEach((string, i) => {
    context.fillText(string, position.x, position.y + 55 + i * margin);
  });
}
