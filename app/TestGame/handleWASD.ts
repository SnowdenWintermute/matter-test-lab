import { Vector } from "matter-js";
import { TestGame } from ".";
import Matter from "matter-js";
import { distBetweenTwoPoints } from "../utils";

enum DIRECTION {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

function calculateDirectionalForce(angle: number, direction: DIRECTION, magnitude: number) {
  if (direction === DIRECTION.UP) return { x: magnitude * Math.cos(angle), y: magnitude * Math.sin(angle) };
  if (direction === DIRECTION.DOWN) return { x: -magnitude * Math.cos(angle), y: -magnitude * Math.sin(angle) };
  if (direction === DIRECTION.RIGHT) return { x: -magnitude * Math.sin(angle), y: magnitude * Math.cos(angle) };
  if (direction === DIRECTION.LEFT) return { x: magnitude * Math.sin(angle), y: -magnitude * Math.cos(angle) };
  return Vector.create(0, 0);
}

export default function handleWASD(game: TestGame) {
  const { inputState, entities, mouseState } = game;
  const playerEntity = entities.playerControlled[0];
  if (!playerEntity) return console.log("no player entity found");
  if (mouseState.position && distBetweenTwoPoints(mouseState.position, playerEntity.body.position) < 10) return;
  const { body, acceleration } = playerEntity;
  const { angle } = body;
  const { up, down, left, right } = inputState;
  if (up) Matter.Body.applyForce(body, body.position, calculateDirectionalForce(angle, DIRECTION.UP, acceleration.current));
  if (down) Matter.Body.applyForce(body, body.position, calculateDirectionalForce(angle, DIRECTION.DOWN, acceleration.getReverse()));
  if (left) Matter.Body.applyForce(body, body.position, calculateDirectionalForce(angle, DIRECTION.LEFT, acceleration.getSideways()));
  if (right) Matter.Body.applyForce(body, body.position, calculateDirectionalForce(angle, DIRECTION.RIGHT, acceleration.getSideways()));
}
