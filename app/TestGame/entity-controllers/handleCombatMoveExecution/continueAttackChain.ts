import { Attack } from "../../entities/Attack";
import { AttackInProgress, MobileEntity } from "../../entities/MobileEntity";
import { Holdable } from "../../holdables/Holdable";
import { clearAttack } from "./clearAttack";

export function continueAttackChain(entity: MobileEntity, attackExecuting: AttackInProgress, holdable: Holdable) {
  if (typeof attackExecuting.chainIndex !== "number" || !holdable.attacks.light) return console.log("failed to continue attack chain");
  attackExecuting.chainIndex += 1;
  const nextAttackDirectionInPreferenceOrder = entity.attackOrderPreference[attackExecuting.chainIndex];
  if (typeof nextAttackDirectionInPreferenceOrder !== "number") clearAttack(entity, attackExecuting);
  const nextAttack = holdable.attacks.light[nextAttackDirectionInPreferenceOrder];
  if (nextAttack) attackExecuting.attack = new Attack(nextAttack, 1);
  else clearAttack(entity, attackExecuting);
}
