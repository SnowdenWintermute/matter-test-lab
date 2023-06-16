import { Vector } from "matter-js";
import { TestGame } from ".";
import { CombatMoveExecutionState, MobileEntity } from "./MobileEntity";
import { normalizeRadians } from "../utils";

function movePointInArc(center: Vector, angle: number, radius: number): Vector {
  const x = center.x + Math.cos(angle) * radius;
  const y = center.y + Math.sin(angle) * radius;
  return { x, y };
}
let numRotations = 0;
export default function handleCombatMoveExecution(
  game: TestGame,
  entity: MobileEntity
) {
  const { inputState } = game;
  const { desiredLeftHandPosition, desiredRightHandPosition, body } = entity;
  if (inputState.arrowUp) desiredLeftHandPosition.pointA.y -= 1;
  if (inputState.arrowDown) desiredLeftHandPosition.pointA.y += 1;
  if (inputState.arrowLeft) desiredLeftHandPosition.pointA.x -= 1;
  if (inputState.arrowRight) desiredLeftHandPosition.pointA.x += 1;

  if (entity.combatMoveExecutionState === CombatMoveExecutionState.AT_REST) {
    entity.combatMoveExecutionState = CombatMoveExecutionState.READYING;
  }
  if (entity.combatMoveExecutionState === CombatMoveExecutionState.READYING) {
    const handPositionLineAngle = normalizeRadians(
      Math.atan2(
        desiredLeftHandPosition.pointA.y - desiredRightHandPosition.pointA.y,
        desiredLeftHandPosition.pointA.x - desiredRightHandPosition.pointA.x
      )
    );
    const normalizedEntityAngle = normalizeRadians(body.angle);
    const angleDiffTolerance = 0.1;
    if (
      handPositionLineAngle !== normalizedEntityAngle &&
      Math.abs(
        normalizeRadians(handPositionLineAngle - normalizedEntityAngle)
      ) > angleDiffTolerance
    ) {
      const { x, y } = movePointInArc(
        desiredRightHandPosition.pointA,
        (Math.PI / 80) * numRotations,
        40
      );
      numRotations += 1;
      desiredLeftHandPosition.pointA.x = x;
      desiredLeftHandPosition.pointA.y = y;
    }
  }
}
