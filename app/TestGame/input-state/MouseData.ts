import { Vector } from "matter-js";

export class MouseState {
  leftPressedAt: Vector | null = null;
  leftReleasedAt: Vector | null = null;
  position: Vector | null = null;
  leftCurrentlyPressed = false;
  mouseOnScreen = true;
  clicksQueued: {
    left: number;
    right: number;
  } = { left: 0, right: 0 };
}
