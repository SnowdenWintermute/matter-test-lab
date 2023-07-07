import { MobileEntity } from "../entities/MobileEntity";
import { Holdable, HoldableGripConstraintCreationData } from "../holdables/Holdable";
import moveGripTowardPosition from "./moveGripTowardPosition";

export default function moveHoldableGripsTowardDestination(
  entity: MobileEntity,
  holdable: Holdable,
  desiredPosition: HoldableGripConstraintCreationData,
  speed: number
) {
  if (!holdable) return;
  const { grips } = holdable;
  if (!grips) return;
  Object.entries(grips).forEach(([pairKey, gripPair]) => {
    Object.entries(gripPair).forEach(([gripKey, grip]) => {
      // @ts-ignore
      moveGripTowardPosition(entity, grip, desiredPosition[pairKey][gripKey], speed);
    });
  });
  holdable.slideGrip();
}
