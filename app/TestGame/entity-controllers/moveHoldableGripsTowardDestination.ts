import { MobileEntity } from "../entities/MobileEntity";
import { Holdable, HoldableGripConstraintCreationData } from "../holdables/Holdable";
import moveGripTowardPosition from "./moveGripTowardPosition";
import { AttackStep } from "../entities/Attack";

export default function moveHoldableGripsTowardDestination(
  entity: MobileEntity,
  holdable: Holdable,
  desiredPosition: HoldableGripConstraintCreationData,
  speed: number,
  step?: AttackStep
) {
  if (!holdable) return;
  const { grips } = holdable;
  if (!grips) return;
  const mainLowerReachedDestination = moveGripTowardPosition(entity, grips.main.lower, desiredPosition.main.lower, speed);
  const mainUpperReachedDestination = moveGripTowardPosition(entity, grips.main.upper, desiredPosition.main.upper, speed);
  if (mainLowerReachedDestination && mainUpperReachedDestination && !grips.support) return true;
  else if (!grips.support || !desiredPosition.support) return false;
  const supportLowerReachedDestination = moveGripTowardPosition(entity, grips.support.lower, desiredPosition.support.lower, speed);
  const supportUpperReachedDestination = moveGripTowardPosition(entity, grips.support.upper, desiredPosition.support.upper, speed);
  if (grips.support && mainLowerReachedDestination && mainUpperReachedDestination && supportLowerReachedDestination && supportUpperReachedDestination) {
    // used to determine if next step needs to translate into place or can directly move in an arc
    // otherwise it may look like the holdable teleports from one step to another
    holdable.previousAttackStepArcCenter = step?.arcCenterOffsetFromBody;
    return true;
  } else return false;
}
