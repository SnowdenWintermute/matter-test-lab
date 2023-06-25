import { TestGame } from ".";
import { MobileEntity } from "./entities/MobileEntity";
import adjustGripPosition from "./adjustGripPosition";
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
  if (!equippedHoldable || !equippedHoldable.grips.a || !equippedHoldable.grips.b) return;
  const { positionOptions, grips } = equippedHoldable;
  if (!grips.a || !grips.b || !grips.c) return;

  if (combatMoveExecutionState === CombatMoveExecutionState.RETURNING_TO_REST && positionOptions.rest?.gripA && positionOptions.rest?.gripB) {
    moveGripTowardPosition(entity, grips.a, positionOptions.rest.gripA, handSpeed);
    moveGripTowardPosition(entity, grips.b, positionOptions.rest.gripB, handSpeed);
    moveGripTowardPosition(entity, grips.c, positionOptions.rest.gripC, handSpeed);
    adjustGripPosition(equippedHoldable);
  }

  if (combatMoveExecutionState === CombatMoveExecutionState.READYING && positionOptions.ready?.gripA && positionOptions.ready?.gripB) {
    moveGripTowardPosition(entity, grips.a, positionOptions.ready.gripA, handSpeed);
    moveGripTowardPosition(entity, grips.b, positionOptions.ready.gripB, handSpeed);
    moveGripTowardPosition(entity, grips.c, positionOptions.ready.gripC, handSpeed);
    adjustGripPosition(equippedHoldable);
  }

  // if (combatMoveExecutionState === CombatMoveExecutionState.STRIKING_FORWARD && positionOptions.forwardStrike?.gripA && positionOptions.forwardStrike?.gripB) {
  //   const reachedPointA = moveGripTowardPosition(entity, grips.a, positionOptions.forwardStrike.gripA, handSpeed * 2);
  //   const reachedPointB = moveGripTowardPosition(entity, grips.b, positionOptions.forwardStrike.gripB, handSpeed * 2);
  //   adjustGripPosition(equippedHoldable);
  //   if (reachedPointA && reachedPointB) entity.combatMoveExecutionState = CombatMoveExecutionState.READYING;
  // }
}
