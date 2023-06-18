import { Vector } from "matter-js";
import { TestGame } from ".";
import { CombatMoveExecutionState, MobileEntity } from "./MobileEntity";
import { distBetweenTwoPoints, getDirectionOfClosestPathToTargetAngle, getPointInArc, movePointTowards, normalizeRadians } from "../utils";
import adjustGripPosition from "./adjustGripPosition";

export default function handleCombatMoveExecution(game: TestGame, entity: MobileEntity) {
  const { inputState } = game;
  const { desiredLeftHandPosition, desiredRightHandPosition, body, spear } = entity;
  const { position, angle } = body;
  if (inputState.arrowUp) entity.combatMoveExecutionState = CombatMoveExecutionState.READYING;
  if (!inputState.arrowUp) entity.combatMoveExecutionState = CombatMoveExecutionState.RETURNING_TO_REST;

  if (entity.combatMoveExecutionState === CombatMoveExecutionState.RETURNING_TO_REST) {
    const lhrp = getPointInArc(position, angle + spear.leftHand.restPositionAngle, spear.leftHand.distanceFromBody);
    const leftHandOffsetFromBody = Vector.add(position, desiredLeftHandPosition.pointA);
    if (distBetweenTwoPoints(leftHandOffsetFromBody, lhrp) < 1) return;
    const { x, y } = movePointTowards(leftHandOffsetFromBody, lhrp, 1);
    entity.desiredLeftHandPosition.pointA.x = x - position.x;
    entity.desiredLeftHandPosition.pointA.y = y - position.y;

    const rhTargetY = spear.rightHand.restPositionOffsetFromBody.y;
    if (desiredRightHandPosition.pointA.y > rhTargetY) desiredRightHandPosition.pointA.y -= 1;
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

    const rhTargetY = spear.rightHand.restPositionOffsetFromBody.y + 10;
    if (desiredRightHandPosition.pointA.y < rhTargetY) desiredRightHandPosition.pointA.y += 1;

    // adjust offhand positionnewLeftHandPointB
    adjustGripPosition(desiredRightHandPosition, desiredLeftHandPosition);
  }
}
