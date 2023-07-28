import { MovementType } from "../../entities/Attack";
import { AttackInProgress, MobileEntity } from "../../entities/MobileEntity";
import { Holdable, HoldableType } from "../../holdables/Holdable";
import moveHoldableGripsInArc from "../moveHoldableGripsInArc";
import moveHoldableGripsTowardDestination from "../moveHoldableGripsTowardDestination";
import { clearAttack } from "./clearAttack";

export function continueAttackExecution(entity: MobileEntity, attackExecuting: AttackInProgress, holdable: Holdable) {
  if (!attackExecuting.attack) return;
  const { timeCurrentStepStarted, currentStepIndex, instructionSet } = attackExecuting.attack;
  const { baseTimeout, steps } = instructionSet;
  const step = steps[currentStepIndex];
  if (!step) return console.log("attempted to continue an attack but the step index was invalid");
  const { movementType } = step;
  const desiredPosition = step.position;

  const speed = entity.handSpeed.current * step.options.speedModifier;
  let reachedDestination;
  if (movementType === MovementType.LINEAR) reachedDestination = moveHoldableGripsTowardDestination(entity, holdable, desiredPosition, speed);
  else if (movementType === MovementType.ARC) reachedDestination = moveHoldableGripsInArc(entity, holdable, step);
  else if (movementType === MovementType.PERPENDICULAR_ARC) reachedDestination = moveHoldableGripsInArc(entity, holdable, step, { perpendicularGrips: true });

  const timeout = step.options?.timeout || baseTimeout;
  const exceededTimeout = +Date.now() - timeCurrentStepStarted > timeout;
  if (exceededTimeout) return clearAttack(entity, attackExecuting, holdable);
  if (!reachedDestination && !exceededTimeout) return;
  if (attackExecuting.attack.isComplete) return;

  attackExecuting.attack.currentStepIndex += 1;
  const completedAllSteps = attackExecuting.attack.currentStepIndex >= steps.length;
  if (completedAllSteps) {
    if (typeof attackExecuting.chainIndex !== "number" || !holdable.attacks.light) return console.log("attempted to mark attack as complete");
    attackExecuting.attack.currentStepIndex -= 1; // put it back to the last valid step index so it will hold position until cleared or continued
    attackExecuting.attack.isComplete = true;
  }
}
