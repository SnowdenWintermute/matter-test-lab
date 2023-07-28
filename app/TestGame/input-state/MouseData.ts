import { Vector } from "matter-js";

export type MouseclickCounts = {
  left: number;
  right: number;
};

export class MouseState {
  leftPressedAt: Vector | null = null;
  leftReleasedAt: Vector | null = null;
  position: Vector | null = null;
  leftCurrentlyPressed = false;
  mouseOnScreen = true;
  clicksQueued: MouseclickCounts = { left: 0, right: 0 };
}
