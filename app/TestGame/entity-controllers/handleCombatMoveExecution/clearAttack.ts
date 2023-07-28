import { AttackInProgress, MobileEntity } from "../../entities/MobileEntity";

export function clearAttack(entity: MobileEntity, attackExecuting: AttackInProgress) {
  attackExecuting.attack = null;
  attackExecuting.chainIndex = null;
}
