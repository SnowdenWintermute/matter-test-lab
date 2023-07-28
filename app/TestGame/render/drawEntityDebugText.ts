import { Hand, MobileEntity } from "../entities/MobileEntity";
import { TestGame } from "..";
import { AttackDirections } from "../entities/Attack";

export default function drawEntityDebugText(context: CanvasRenderingContext2D, entity: MobileEntity, game: TestGame) {
  const { position, angle } = entity.body;
  const holdable = entity.equippedHoldables[Hand.RIGHT];
  if (!holdable) return;
  // const { attacksCurrentlyExecuting } = entity;
  // const offhandAttack = attacksCurrentlyExecuting[Hand.LEFT];
  // const { chainIndex } = offhandAttack;
  // let stepName = undefined;
  // if (typeof chainIndex === "number") stepName = AttackDirections[chainIndex];
  // const currentStepIndex = offhandAttack.attack?.currentStepIndex;
  // let currentStep;
  // if (typeof currentStepIndex === "number" && typeof chainIndex === "number" && offhandAttack.attack)
  //   currentStep = offhandAttack.attack.instructionSet[stepName][currentStepIndex];

  const text = [`CLICKS QUEUED: ${game.mouseState.clicksQueued.left}`, `OFFHAND STEP ANGLE: ${"a"}`];
  const margin = 18;
  context.fillStyle = "pink";
  context.textAlign = "center";
  text.forEach((string, i) => {
    context.fillText(string, position.x, position.y + 55 + i * margin);
  });
}
