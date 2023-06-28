import { Holdable } from "../holdables/Holdable";

export default function loosenGrips(holdable: Holdable) {
  const { grips } = holdable;

  if (grips?.support) {
    const { upper, lower } = grips.support;
    upper.stiffness = 0.1;
    lower.stiffness = 0.1;
    grips.main.upper.stiffness = 0.2;
    grips.main.lower.stiffness = 0.2;
  }
}
