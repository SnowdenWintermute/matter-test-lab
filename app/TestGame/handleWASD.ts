import { Vector } from "matter-js";
import { TestGame } from ".";
import Matter from "matter-js";

enum DIRECTION {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

function calculateDirectionalForce(
  angle: number,
  direction: DIRECTION,
  magnitude: number
) {
  if (direction === DIRECTION.UP)
    return { x: magnitude * Math.cos(angle), y: magnitude * Math.sin(angle) };
  if (direction === DIRECTION.DOWN)
    return { x: -magnitude * Math.cos(angle), y: -magnitude * Math.sin(angle) };
  if (direction === DIRECTION.RIGHT)
    return { x: -magnitude * Math.sin(angle), y: magnitude * Math.cos(angle) };
  if (direction === DIRECTION.LEFT)
    return { x: magnitude * Math.sin(angle), y: -magnitude * Math.cos(angle) };
  return Vector.create(0, 0);
}

export default function handleWASD(game: TestGame) {
  const { inputState, entities } = game;
  const playerEntity = entities.playerControlled[0];
  const {
    body,
    acceleration,
    sidewaysAccelerationModifier,
    reverseAccelerationModifier,
  } = playerEntity;
  const { angle } = body;
  if (inputState.up)
    Matter.Body.applyForce(
      body,
      body.position,
      calculateDirectionalForce(angle, DIRECTION.UP, acceleration)
    );
  if (inputState.down)
    Matter.Body.applyForce(
      body,
      body.position,
      calculateDirectionalForce(
        angle,
        DIRECTION.DOWN,
        acceleration * reverseAccelerationModifier
      )
    );
  if (inputState.left)
    Matter.Body.applyForce(
      body,
      body.position,
      calculateDirectionalForce(
        angle,
        DIRECTION.LEFT,
        acceleration * sidewaysAccelerationModifier
      )
    );
  if (inputState.right)
    Matter.Body.applyForce(
      body,
      body.position,
      calculateDirectionalForce(
        angle,
        DIRECTION.RIGHT,
        acceleration * sidewaysAccelerationModifier
      )
    );
}
