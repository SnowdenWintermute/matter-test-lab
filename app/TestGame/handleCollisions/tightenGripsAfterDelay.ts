import { Holdable } from "../holdables/Holdable";

export default function tightenGripsAfterDelay(holdable: Holdable) {
  const { grips } = holdable;
  if (grips?.support) {
    const { upper, lower } = grips.support;
    setTimeout(() => {
      upper.stiffness = 1;
      lower.stiffness = 1;
      grips.main.upper.stiffness = 1;
      grips.main.lower.stiffness = 1;
    }, 500);
  }
}
