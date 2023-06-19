import { TestGame } from ".";
import { CombatMoveExecutionState, MobileEntity } from "./entities/MobileEntity";
import adjustGripPosition from "./adjustGripPosition";
import moveHandTowardPosition from "./moveHandTowardPosition";

export default function handleCombatMoveExecution(game: TestGame, entity: MobileEntity) {
  const { inputState } = game;
  const { desiredLeftHandPosition, desiredRightHandPosition, body, spear } = entity;
  if (inputState.arrowUp) entity.combatMoveExecutionState = CombatMoveExecutionState.READYING;
  if (!inputState.arrowUp) entity.combatMoveExecutionState = CombatMoveExecutionState.RETURNING_TO_REST;

  if (entity.combatMoveExecutionState === CombatMoveExecutionState.RETURNING_TO_REST) {
    moveHandTowardPosition(entity, entity.desiredLeftHandPosition, entity.spear.leftHandRestPosition, entity.handSpeed);
    moveHandTowardPosition(entity, entity.desiredRightHandPosition, entity.spear.rightHandRestPosition, entity.handSpeed);
    adjustGripPosition(desiredRightHandPosition, desiredLeftHandPosition);
  }

  if (entity.combatMoveExecutionState === CombatMoveExecutionState.READYING) {
    moveHandTowardPosition(entity, entity.desiredLeftHandPosition, entity.spear.leftHandReadyPosition, entity.handSpeed);
    moveHandTowardPosition(entity, entity.desiredRightHandPosition, entity.spear.rightHandReadyPosition, entity.handSpeed);
    adjustGripPosition(desiredRightHandPosition, desiredLeftHandPosition);
  }
}
