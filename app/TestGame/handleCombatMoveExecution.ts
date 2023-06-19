import { Vector } from "matter-js";
import { TestGame } from ".";
import { CombatMoveExecutionState, MobileEntity } from "./entities/MobileEntity";
import { distBetweenTwoPoints, getDirectionOfClosestPathToTargetAngle, getPointInArc, movePointTowards, normalizeRadians } from "../utils";
import adjustGripPosition from "./adjustGripPosition";
import moveHandTowardRestingPosition from "./moveHandTowardRestingPosition";

export default function handleCombatMoveExecution(game: TestGame, entity: MobileEntity) {
  const { inputState } = game;
  const { desiredLeftHandPosition, desiredRightHandPosition, body, spear } = entity;
  const { position, angle } = body;
  if (inputState.arrowUp) entity.combatMoveExecutionState = CombatMoveExecutionState.READYING;
  if (!inputState.arrowUp) entity.combatMoveExecutionState = CombatMoveExecutionState.RETURNING_TO_REST;

  if (entity.combatMoveExecutionState === CombatMoveExecutionState.RETURNING_TO_REST) {
    moveHandTowardRestingPosition(entity, entity.desiredLeftHandPosition, entity.spear.leftHandRestPosition);
    moveHandTowardRestingPosition(entity, entity.desiredRightHandPosition, entity.spear.rightHandRestPosition);
    adjustGripPosition(desiredRightHandPosition, desiredLeftHandPosition);
  }

  if (entity.combatMoveExecutionState === CombatMoveExecutionState.READYING) {
    const handPositionAngle = Math.atan2(
      desiredLeftHandPosition.pointA.y - desiredRightHandPosition.pointA.y,
      desiredLeftHandPosition.pointA.x - desiredRightHandPosition.pointA.x
    );
    const normalizedHandPositionAngle = normalizeRadians(handPositionAngle);
    const angleDiffTolerance = Math.PI / 40;
    const dir = getDirectionOfClosestPathToTargetAngle(handPositionAngle, body.angle, angleDiffTolerance);

    const { x, y } = getPointInArc(desiredRightHandPosition.pointA, angleDiffTolerance * dir + normalizedHandPositionAngle, 20);
    desiredLeftHandPosition.pointA.x = x;
    desiredLeftHandPosition.pointA.y = y;

    const rhTargetY = spear.rightHandRestPosition.offset.y + 10;
    if (desiredRightHandPosition.pointA.y < rhTargetY) desiredRightHandPosition.pointA.y += 1;

    // adjust offhand positionnewLeftHandPointB
    adjustGripPosition(desiredRightHandPosition, desiredLeftHandPosition);
  }
}
