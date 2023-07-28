import { AttackInProgress, MobileEntity } from "../../entities/MobileEntity";
import { Holdable } from "../../holdables/Holdable";

export function clearAttack(entity: MobileEntity, attackExecuting: AttackInProgress, holdable: Holdable) {
  attackExecuting.attack = null;
  attackExecuting.chainIndex = null;
  holdable.previousAttackStep.arcCenter = undefined;
  holdable.previousAttackStep.movementType = undefined;
}
