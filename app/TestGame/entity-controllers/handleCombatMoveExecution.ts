import { getDirectionAndDiffOfClosestPathToTargetAngle, movePointTowards } from "@/app/utils";
import { TestGame } from "..";
import { Attack, MovementType } from "../entities/Attack";
import { MobileEntity } from "../entities/MobileEntity";
import { HoldableGripConstraintCreationData } from "../holdables/Holdable";
import moveGripTowardPosition from "./moveGripTowardPosition";
import moveHoldableGripsTowardDestination from "./moveHoldableGripsTowardDestination";
import moveHoldableGripsInArc from "./moveHoldableGripsInArc";

export default function handleCombatMoveExecution(game: TestGame, entity: MobileEntity) {
  // if baseTimeout modified by handSpeed is reached, go to rest position and end attack
  // if attack input is received before execution of the last position, start the next attack instead of executing the last position
  // if guard input received, finish the current attack then enter guard position
  const { currentAttackExecuting, handSpeed } = entity;
  const equippedHoldable = entity.equippedHoldables.rightHand;
  if (!equippedHoldable) return;
  if (!currentAttackExecuting) return moveHoldableGripsTowardDestination(entity, equippedHoldable, equippedHoldable.restPosition, handSpeed.current);
  const { timeCurrentStepStarted, currentStepIndex, nextAttack, instructionSet, damageModifier } = currentAttackExecuting;
  const { baseTimeout, cooldown, steps } = instructionSet;
  const step = steps[currentStepIndex];
  const { movementType, arcCenterOffsetFromBody, damageType, onStart, onReached } = step;
  const desiredPosition = step.position;

  let reachedDestination;
  if (movementType === MovementType.LINEAR)
    reachedDestination = moveHoldableGripsTowardDestination(entity, equippedHoldable, desiredPosition, handSpeed.current);
  else if (movementType === MovementType.ARC) moveHoldableGripsInArc(entity, equippedHoldable, step);

  const timeout = step.timeout || baseTimeout;
  const exceededTimeout = +Date.now() - timeCurrentStepStarted > timeout;
  if (!reachedDestination && !exceededTimeout) return;
  currentAttackExecuting.currentStepIndex += 1;
  const completedAllSteps = currentAttackExecuting.currentStepIndex >= steps.length;
  if (!completedAllSteps) return;

  if (!nextAttack) entity.currentAttackExecuting = null;
  else entity.currentAttackExecuting = new Attack(nextAttack, 1);
}
