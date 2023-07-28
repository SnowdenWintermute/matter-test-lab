import { TestGame } from "../..";
import { Hand, MobileEntity } from "../../entities/MobileEntity";
import moveHoldableGripsTowardDestination from "../moveHoldableGripsTowardDestination";
import { clearAttack } from "./clearAttack";
import { continueAttackChain } from "./continueAttackChain";
import { continueAttackExecution } from "./continueAttackExecution";
import { startAttackChain } from "./startAttackChain";

export default function handleCombatMoveExecution(game: TestGame, entity: MobileEntity) {
  const { handSpeed } = entity;
  const { clicksQueued } = game.mouseState;
  const mainHandHoldable = entity.equippedHoldables[entity.mainHand];
  const mainHandAttack = entity.attacksCurrentlyExecuting[entity.mainHand];
  const offHand = entity.mainHand === Hand.RIGHT ? Hand.LEFT : Hand.RIGHT;
  const offHandHoldable = entity.equippedHoldables[offHand];
  const offHandAttack = entity.attacksCurrentlyExecuting[offHand];
  const neitherHandIsAttacking = !mainHandAttack.attack && !offHandAttack.attack;
  const bothAttacksComplete = mainHandAttack.attack?.isComplete && offHandAttack.attack?.isComplete;
  if (clicksQueued.left) {
    if (neitherHandIsAttacking) {
      if (mainHandHoldable) startAttackChain(entity, mainHandAttack, mainHandHoldable);
      if (offHandHoldable) startAttackChain(entity, offHandAttack, offHandHoldable);
      clicksQueued.left -= 1;
      return;
    } else if (bothAttacksComplete || (mainHandAttack.attack?.isComplete && !offHandHoldable) || (offHandAttack.attack?.isComplete && !mainHandHoldable)) {
      if (mainHandAttack && mainHandHoldable) continueAttackChain(entity, mainHandAttack, mainHandHoldable);
      if (offHandAttack && offHandHoldable) continueAttackChain(entity, offHandAttack, offHandHoldable);
      if (mainHandAttack.attack && offHandAttack.attack) clicksQueued.left -= 1;
      else clicksQueued.left = 0;
      return;
    }
  }

  if (neitherHandIsAttacking || bothAttacksComplete) {
    if (bothAttacksComplete) {
      clearAttack(entity, mainHandAttack, mainHandHoldable);
      clearAttack(entity, offHandAttack, offHandHoldable);
    }
    if (mainHandHoldable) moveHoldableGripsTowardDestination(entity, mainHandHoldable, mainHandHoldable.restPosition, handSpeed.current);
    if (offHandHoldable) moveHoldableGripsTowardDestination(entity, offHandHoldable, offHandHoldable.restPosition, handSpeed.current);
  } else if (!mainHandAttack.attack?.isComplete || !offHandAttack.attack?.isComplete) {
    if (mainHandAttack && mainHandHoldable) continueAttackExecution(entity, mainHandAttack, mainHandHoldable);
    if (offHandAttack && offHandHoldable) continueAttackExecution(entity, offHandAttack, offHandHoldable);
  }
}
