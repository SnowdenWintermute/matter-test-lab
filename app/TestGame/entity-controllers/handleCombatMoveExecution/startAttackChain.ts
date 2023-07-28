import { Attack } from "../../entities/Attack";
import { AttackInProgress, MobileEntity } from "../../entities/MobileEntity";
import { Holdable } from "../../holdables/Holdable";

export function startAttackChain(entity: MobileEntity, attackExecuting: AttackInProgress, holdable: Holdable) {
  if (!holdable.attacks.light) return;
  attackExecuting.chainIndex = 0;
  const firstAttackInLightAttackChainPreferenceOrder = entity.attackOrderPreference[0];
  const attackInstructions = holdable.attacks.light[firstAttackInLightAttackChainPreferenceOrder];
  if (!attackInstructions) return;
  attackExecuting.attack = new Attack(attackInstructions, 1);
}
