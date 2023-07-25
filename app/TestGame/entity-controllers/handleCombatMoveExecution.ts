import { TestGame } from "..";
import { Attack, AttackDirections, MovementType } from "../entities/Attack";
import { MobileEntity } from "../entities/MobileEntity";
import moveHoldableGripsTowardDestination from "./moveHoldableGripsTowardDestination";
import moveHoldableGripsInArc from "./moveHoldableGripsInArc";

export default function handleCombatMoveExecution(game: TestGame, entity: MobileEntity) {
  // if baseTimeout modified by handSpeed is reached, go to rest position and end attack
  // if attack input is received before execution of the last position, start the next attack instead of executing the last position
  // if guard input received, finish the current attack then enter guard position
  const { currentAttackExecuting, handSpeed } = entity;
  const { clicksQueued } = game.mouseState;
  const equippedHoldable = entity.equippedHoldables.rightHand;
  if (!equippedHoldable) return;
  if (clicksQueued.left && !currentAttackExecuting) {
    entity.currentAttackOrderIndex = 0;
    const firstAttackInPreferenceOrder = entity.attackOrderPreference[entity.currentAttackOrderIndex];
    if (!equippedHoldable.attacks.light || !equippedHoldable.attacks.light[firstAttackInPreferenceOrder]) return;
    //@ts-ignore
    entity.currentAttackExecuting = new Attack(equippedHoldable.attacks.light[firstAttackInPreferenceOrder], 1);
    entity.currentAttackOrderIndex = 0;
    clicksQueued.left -= 1;
  }
  if (!currentAttackExecuting) return moveHoldableGripsTowardDestination(entity, equippedHoldable, equippedHoldable.restPosition, handSpeed.current);
  const { timeCurrentStepStarted, currentStepIndex, instructionSet } = currentAttackExecuting;
  const { baseTimeout, cooldown, steps } = instructionSet;
  const step = steps[currentStepIndex];
  if (!step) return;
  const { movementType } = step;
  const desiredPosition = step.position;

  let reachedDestination;
  if (movementType === MovementType.LINEAR)
    reachedDestination = moveHoldableGripsTowardDestination(entity, equippedHoldable, desiredPosition, handSpeed.current, step);
  else if (movementType === MovementType.ARC) reachedDestination = moveHoldableGripsInArc(entity, equippedHoldable, step);

  const timeout = step.timeout || baseTimeout;
  const exceededTimeout = +Date.now() - timeCurrentStepStarted > timeout;
  if (!reachedDestination && !exceededTimeout) return;
  currentAttackExecuting.currentStepIndex += 1;
  const completedAllSteps = currentAttackExecuting.currentStepIndex >= steps.length;
  if (!completedAllSteps) return;
  if (entity.currentAttackOrderIndex === null) return;
  entity.currentAttackOrderIndex += 1;
  const nextAttackDirectionInPreferenceOrder = entity.attackOrderPreference[entity.currentAttackOrderIndex];
  if (typeof nextAttackDirectionInPreferenceOrder !== "number") return;
  // @ts-ignore
  const nextAttack = equippedHoldable.attacks.light[nextAttackDirectionInPreferenceOrder];
  console.log("nextAttack: ", nextAttack);
  if (!nextAttack) {
    entity.currentAttackExecuting = null;
    clicksQueued.left = 0;
  } else if (clicksQueued.left) {
    entity.currentAttackExecuting = new Attack(nextAttack, 1);
    clicksQueued.left -= 1;
    console.log("assigning new attack at line 48: ", entity.currentAttackExecuting);
  } else entity.currentAttackExecuting = null;
}
