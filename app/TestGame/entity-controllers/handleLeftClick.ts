import { TestGame } from "..";
import { Attack } from "../entities/Attack";
import { MobileEntity } from "../entities/MobileEntity";

export default function handleLeftClick(game: TestGame, playerEntity: MobileEntity) {
  const { inputState } = game;
  if (!inputState.mouseLeftPressedTimestamp) return;
  const equippedHoldable = playerEntity.equippedHoldables.rightHand;
  if (!equippedHoldable) return;

  const durationHeld = +Date.now() - inputState.mouseLeftPressedTimestamp;
  const heavyAttackHoldDurationThreshold = 500;
  const mouseLeftReleased = game.prevInputState.mouseLeft && !inputState.mouseLeft && durationHeld;

  if (durationHeld >= heavyAttackHoldDurationThreshold) {
    // execute heavy attack
    console.log("heavy attack input received");
  } else if (mouseLeftReleased) {
    // player has released the left mouse button
    // execute light attack or queue next position in light attack chain
    if (!equippedHoldable.attacks.light) return;
    const { attackOrderPreference, currentAttackOrderIndex } = playerEntity;
    if (!playerEntity.currentAttackExecuting) {
      // choose the first light attack in the chain
      const attackInstructions = equippedHoldable.attacks.light[attackOrderPreference[0]] || equippedHoldable.attacks.light[0];
      if (!attackInstructions) return;
      playerEntity.currentAttackExecuting = new Attack(attackInstructions, 1);
      playerEntity.currentAttackOrderIndex = 0;
    } else {
      if (typeof currentAttackOrderIndex !== "number") return;
      const nextAttackInOrderPreference = attackOrderPreference[currentAttackOrderIndex + 1];
      if (!nextAttackInOrderPreference) return; // should leave the current attack's "next attack" unmodified (null), thus will result in a return to rest position upon its completion
      const nextAttackInstructions = equippedHoldable.attacks.light[nextAttackInOrderPreference];
      if (!nextAttackInstructions) return; // if this is the case, the holdable doesn't have the attack listed in the preferences
      playerEntity.currentAttackExecuting.nextAttack = nextAttackInstructions;
      // in the combat execution function, step currently executing attacks forward and upon their resolution invoke the nextAttack or if no attack exists
      // begin returning to rest
    }
  }

  if (mouseLeftReleased || durationHeld >= heavyAttackHoldDurationThreshold) inputState.mouseLeftPressedTimestamp = null;
}
