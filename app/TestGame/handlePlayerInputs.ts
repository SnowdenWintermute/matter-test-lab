import Matter, { Vector } from "matter-js";
import { TestGame } from "../TestGame";
import { CSPlayerInputState } from "./CSInputState";
import { MobileEntity } from "./MobileEntity";

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

function angleDiffWithinThreshold(
  inputState: CSPlayerInputState,
  entity: MobileEntity
): boolean {
  if (!(typeof inputState.targetAngle === "number")) return false;
  console.log(entity.body.angle % (Math.PI * 2));
  const angleDiff =
    inputState.targetAngle - (entity.body.angle % (Math.PI * 2));
  if (Math.abs(angleDiff) > entity.turningSpeed) return true;
  return false;
}

export default function handlePlayerInputs(game: TestGame) {
  const { inputState, entities } = game;
  const playerEntity = entities.playerControlled[0];
  const {
    body,
    acceleration,
    sidewaysAccelerationModifier,
    reverseAccelerationModifier,
  } = playerEntity;
  // console.log(entities.playerControlled[0]);
  // console.log(inputState.up);
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
        acceleration * sidewaysAccelerationModifier
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
        acceleration * reverseAccelerationModifier
      )
    );

  game.inputState.turnRight = false;
  game.inputState.turnLeft = false;
  const { mouseState } = game;
  if (mouseState.position) {
    const targetAngle = Math.atan2(
      mouseState.position.y - body.position.y,
      mouseState.position.x - body.position.x
    );
    inputState.targetAngle = targetAngle;
    const bodyAngleMod = body.angle % (Math.PI * 2);
    const angleDifference = targetAngle - bodyAngleMod;

    // let adjustedDifference = angleDiff;
    // if (angleDiff > Math.PI) adjustedDifference -= 2 * Math.PI;
    // else if (angleDiff < -Math.PI) adjustedDifference += 2 * Math.PI;
    // const rotationDirection = adjustedDifference > 0 ? 1 : -1;

    // if (rotationDirection > 0) game.inputState.turnLeft = true;
    // else game.inputState.turnLeft = false;
    // if (rotationDirection < 0) game.inputState.turnRight = true;
    // else game.inputState.turnRight = false;
  }

  if (inputState.turnLeft) {
    // if (angleDiffWithinThreshold(inputState, playerEntity))
    //   Matter.Body.setAngle(body, body.angle + playerEntity.turningSpeed);
    // else if (inputState.targetAngle)
    //   Matter.Body.setAngle(body, inputState.targetAngle);
  }
  if (inputState.turnRight) {
    // if (angleDiffWithinThreshold(inputState, playerEntity))
    //   Matter.Body.setAngle(body, body.angle - playerEntity.turningSpeed);
    // else if (inputState.targetAngle)
    //   Matter.Body.setAngle(body, inputState.targetAngle);
  }
}
