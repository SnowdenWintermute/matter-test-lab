import { TestGame } from "..";
import { MobileEntity } from "../entities/MobileEntity";
import moveHoldableGripsTowardDestination from "./moveHoldableGripsTowardDestination";

export default function handleCombatMoveExecution(game: TestGame, entity: MobileEntity) {
  const { currentAttackExecuting, handSpeed } = entity;
  const equippedHoldable = entity.equippedHoldables.rightHand;
  if (!equippedHoldable) return;
  if (!currentAttackExecuting) moveHoldableGripsTowardDestination(entity, equippedHoldable, equippedHoldable.restPosition, handSpeed.current);

  // if (combatMoveExecutionState === CombatMoveExecutionState.STRIKING_FORWARD && positionOptions.forwardStrike) {
  //   let reachedTargetDestination = false;
  //   Object.entries(grips).forEach(([pairKey, gripPair]) => {
  //     Object.entries(gripPair).forEach(([gripKey, grip]) => {
  //       // @ts-ignore
  //       reachedTargetDestination = moveGripTowardPosition(entity, grip, positionOptions.forwardStrike[pairKey][gripKey], handSpeed.current);
  //     });
  //   });
  //   equippedHoldable.slideGrip();
  //   if (reachedTargetDestination) entity.combatMoveExecutionState = CombatMoveExecutionState.READYING;
  // }
}
