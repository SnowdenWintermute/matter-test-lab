import { TestGame } from "..";
import { Attack, MovementType } from "../entities/Attack";
import { MobileEntity } from "../entities/MobileEntity";
import moveHoldableGripsTowardDestination from "./moveHoldableGripsTowardDestination";
import moveHoldableGripsInArc from "./moveHoldableGripsInArc";
import { HoldableType } from "../holdables/Holdable";

function clearCurrentAttack(entity: MobileEntity, clicksQueued: { left: number; right: number }) {
  clicksQueued.left = 0;
  entity.currentAttackExecuting = null;
  entity.currentAttackOrderIndex = null;
  entity.body.isStatic = false;
}

export default function handleCombatMoveExecution(game: TestGame, entity: MobileEntity) {
  // if baseTimeout modified by handSpeed is reached, go to rest position and end attack
  // if attack input is received before execution of the last position, start the next attack instead of executing the last position
  // if guard input received, finish the current attack then enter guard position
  const { currentAttackExecuting, handSpeed } = entity;
  const { clicksQueued } = game.mouseState;
  // console.log(clicksQueued);
  // const equippedHoldable = entity.equippedHoldables.rightHand;
  Object.entries(entity.equippedHoldables).forEach(([hand, equippedHoldable]) => {
    if (!equippedHoldable) return;
    const isMainHand = entity.mainHand === Number(hand);
    // if (equippedHoldable.type === HoldableType.SHIELD) return;
    // console.log(Number(hand), entity.mainHand, isMainHand);

    if (clicksQueued.left && !currentAttackExecuting && isMainHand) {
      entity.currentAttackOrderIndex = 0;
      const firstAttackInPreferenceOrder = entity.attackOrderPreference[entity.currentAttackOrderIndex];
      if (!equippedHoldable.attacks.light || !equippedHoldable.attacks.light[firstAttackInPreferenceOrder]) return;
      //@ts-ignore
      entity.currentAttackExecuting = new Attack(equippedHoldable.attacks.light[firstAttackInPreferenceOrder], 1);
      entity.currentAttackOrderIndex = 0;
      clicksQueued.left -= 1;
      return;
    }
    if (!currentAttackExecuting) return moveHoldableGripsTowardDestination(entity, equippedHoldable, equippedHoldable.restPosition, handSpeed.current);

    entity.body.isStatic = true;
    const { timeCurrentStepStarted, currentStepIndex, instructionSet } = currentAttackExecuting;
    const { baseTimeout, cooldown, steps } = instructionSet;
    const step = steps[currentStepIndex];
    if (!step) return;
    const { movementType } = step;
    const desiredPosition = step.position;

    let reachedDestination;
    if (movementType === MovementType.LINEAR)
      reachedDestination = moveHoldableGripsTowardDestination(entity, equippedHoldable, desiredPosition, handSpeed.current);
    else if (movementType === MovementType.ARC) reachedDestination = moveHoldableGripsInArc(entity, equippedHoldable, step);
    else if (movementType === MovementType.PERPENDICULAR_ARC)
      reachedDestination = moveHoldableGripsInArc(entity, equippedHoldable, step, { perpendicularGrips: true });

    const timeout = step.timeout || baseTimeout;
    const exceededTimeout = +Date.now() - timeCurrentStepStarted > timeout;
    if (!reachedDestination && !exceededTimeout) return;

    currentAttackExecuting.currentStepIndex += 1; // steps in current attack
    const completedAllSteps = currentAttackExecuting.currentStepIndex >= steps.length;
    if (!completedAllSteps) return;
    if (entity.currentAttackOrderIndex === null) return;
    entity.currentAttackOrderIndex += 1; // attack in chain of queued light attacks
    const nextAttackDirectionInPreferenceOrder = entity.attackOrderPreference[entity.currentAttackOrderIndex];
    if (typeof nextAttackDirectionInPreferenceOrder !== "number" && isMainHand) clearCurrentAttack(entity, clicksQueued);
    // @ts-ignore
    const nextAttack = equippedHoldable.attacks.light[nextAttackDirectionInPreferenceOrder];
    if (nextAttack && clicksQueued.left && isMainHand) {
      entity.currentAttackExecuting = new Attack(nextAttack, 1);
      clicksQueued.left -= 1;
    } else if (isMainHand) clearCurrentAttack(entity, clicksQueued);
  });
}
