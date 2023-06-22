import { TestGame } from ".";
import { CombatMoveExecutionState, EntityStance, MobileEntity } from "./entities/MobileEntity";
import adjustGripPosition from "./adjustGripPosition";
import moveGripTowardPosition from "./moveGripTowardPosition";

export default function handleCombatMoveExecution(game: TestGame, entity: MobileEntity) {
  const { inputState } = game;
  // const { desiredLeftHandPosition, desiredRightHandPosition, body, spear } = entity;
  // if (inputState.arrowUp) entity.combatMoveExecutionState = CombatMoveExecutionState.READYING;
  // if (!inputState.arrowUp) entity.combatMoveExecutionState = CombatMoveExecutionState.RETURNING_TO_REST;
  if (entity.stance === EntityStance.COMBAT_READY) entity.combatMoveExecutionState = CombatMoveExecutionState.READYING;
  if (entity.stance === EntityStance.AT_EASE) entity.combatMoveExecutionState = CombatMoveExecutionState.RETURNING_TO_REST;
  const equippedHoldable = entity.equippedHoldables.rightHand;
  if (!equippedHoldable || !equippedHoldable.grips.a || !equippedHoldable.grips.b) return;
  if (
    entity.combatMoveExecutionState === CombatMoveExecutionState.RETURNING_TO_REST &&
    equippedHoldable.positionOptions.rest?.gripA &&
    equippedHoldable.positionOptions.rest?.gripB
  ) {
    moveGripTowardPosition(entity, equippedHoldable.grips.a, equippedHoldable.positionOptions.rest.gripA, entity.handSpeed);
    moveGripTowardPosition(entity, equippedHoldable.grips.b, equippedHoldable.positionOptions.rest.gripB, entity.handSpeed);
    adjustGripPosition(equippedHoldable, entity);
  }

  if (
    entity.combatMoveExecutionState === CombatMoveExecutionState.READYING &&
    equippedHoldable.positionOptions.ready?.gripA &&
    equippedHoldable.positionOptions.ready?.gripB
  ) {
    moveGripTowardPosition(entity, equippedHoldable.grips.a, equippedHoldable.positionOptions.ready.gripA, entity.handSpeed);
    moveGripTowardPosition(entity, equippedHoldable.grips.b, equippedHoldable.positionOptions.ready.gripB, entity.handSpeed);
    adjustGripPosition(equippedHoldable, entity);
  }
  // if (entity.combatMoveExecutionState === CombatMoveExecutionState.READYING) {
  //   moveHandTowardPosition(entity, entity.desiredLeftHandPosition, entity.spear.leftHandReadyPosition, entity.handSpeed);
  //   moveHandTowardPosition(entity, entity.desiredRightHandPosition, entity.spear.rightHandReadyPosition, entity.handSpeed);
  //   adjustGripPosition(desiredRightHandPosition, desiredLeftHandPosition);
  // }
}
