export enum EntityCategory {
  HOLDABLE,
  ARMOR,
  PLAYER_CONTROLLED,
  MOBILE,
  STATIC,
}

export enum EntityStance {
  AT_EASE,
  COMBAT_READY,
}

export enum CombatMoveExecutionState {
  AT_REST,
  READYING,
  STRIKING_FORWARD,
  RETURNING_TO_READY,
  RETURNING_TO_REST,
}
