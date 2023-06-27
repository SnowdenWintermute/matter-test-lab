import { TestGame } from ".";
import { MobileEntity } from "./entities/MobileEntity";
import slideGripOnHoldable from "./slideGripOnHoldable";
import moveGripTowardPosition from "./moveGripTowardPosition";
import { CombatMoveExecutionState, EntityStance } from "./enums";
import { PointRelativeToBody } from "./holdables/PointRelativeToBody";
import { angleBetweenPoints, getPointInArc } from "../utils";

export default function handleCombatMoveExecution(game: TestGame, entity: MobileEntity) {
  const { stance, handSpeed, combatMoveExecutionState, body } = entity;
  if (stance === EntityStance.COMBAT_READY && combatMoveExecutionState !== CombatMoveExecutionState.STRIKING_FORWARD)
    entity.combatMoveExecutionState = CombatMoveExecutionState.READYING;
  if (stance === EntityStance.AT_EASE) entity.combatMoveExecutionState = CombatMoveExecutionState.RETURNING_TO_REST;
  const equippedHoldable = entity.equippedHoldables.rightHand;
  if (!equippedHoldable || !equippedHoldable.grips) return;
  const { positionOptions, grips } = equippedHoldable;

  if (combatMoveExecutionState === CombatMoveExecutionState.RETURNING_TO_REST && positionOptions.rest) {
    Object.entries(grips).forEach(([pairKey, gripPair]) => {
      Object.entries(gripPair).forEach(([gripKey, grip]) => {
        // @ts-ignore
        moveGripTowardPosition(entity, grip, positionOptions.rest[pairKey][gripKey], handSpeed);
      });
    });
    slideGripOnHoldable(equippedHoldable);
  }

  if (combatMoveExecutionState === CombatMoveExecutionState.READYING && positionOptions.ready) {
    Object.entries(grips).forEach(([pairKey, gripPair]) => {
      Object.entries(gripPair).forEach(([gripKey, grip]) => {
        // @ts-ignore
        moveGripTowardPosition(entity, grip, positionOptions.ready[pairKey][gripKey], handSpeed);
      });
    });
    slideGripOnHoldable(equippedHoldable);
  }

  if (combatMoveExecutionState === CombatMoveExecutionState.STRIKING_FORWARD && positionOptions.forwardStrike) {
    let reachedTargetDestination = false;
    Object.entries(grips).forEach(([pairKey, gripPair]) => {
      Object.entries(gripPair).forEach(([gripKey, grip]) => {
        // @ts-ignore
        reachedTargetDestination = moveGripTowardPosition(entity, grip, positionOptions.forwardStrike[pairKey][gripKey], handSpeed);
      });
    });
    slideGripOnHoldable(equippedHoldable);
    if (reachedTargetDestination) entity.combatMoveExecutionState = CombatMoveExecutionState.READYING;
  }
}
