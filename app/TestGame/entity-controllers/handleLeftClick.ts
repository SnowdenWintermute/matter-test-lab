import { TestGame } from "..";
import { Attack } from "../entities/Attack";
import { MobileEntity } from "../entities/MobileEntity";

export default function handleLeftClick(game: TestGame, playerEntity: MobileEntity) {
  const { inputState, mouseState } = game;
  if (!inputState.mouseLeftPressedTimestamp) return;
  const equippedHoldable = playerEntity.equippedHoldables.rightHand;
  if (!equippedHoldable) return;

  const durationHeld = +Date.now() - inputState.mouseLeftPressedTimestamp;
  const heavyAttackHoldDurationThreshold = 500;
  const mouseLeftReleased = game.prevInputState.mouseLeft && !inputState.mouseLeft && durationHeld;

  if (durationHeld >= heavyAttackHoldDurationThreshold) {
    console.log("heavy attack input received");
  } else if (mouseLeftReleased) mouseState.clicksQueued.left += 1;

  if (mouseLeftReleased || durationHeld >= heavyAttackHoldDurationThreshold) inputState.mouseLeftPressedTimestamp = null;
}
