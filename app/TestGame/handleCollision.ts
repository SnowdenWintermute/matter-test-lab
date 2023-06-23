import { TestGame } from ".";
import { EntityCategory } from "./enums";

export default function handleCollision(event: Matter.IEventCollision<Matter.Engine>, game: TestGame) {
  var pairs = event.pairs;
  for (var i = 0, j = pairs.length; i != j; i += 1) {
    const pair = pairs[i];
    const { bodyA, bodyB } = pair;
    const [bodyACategory, bodyAEntityId] = bodyA.label.split("-").map((value) => Number(value));
    const [bodyBCategory, bodyBEntityId] = bodyB.label.split("-").map((value) => Number(value));
    if (bodyACategory !== EntityCategory.HOLDABLE && bodyBCategory !== EntityCategory.HOLDABLE) return;
    const holdableEntityId = bodyACategory === EntityCategory.HOLDABLE ? bodyAEntityId : bodyBEntityId;
    const otherBodyEntityId = bodyACategory === EntityCategory.HOLDABLE ? bodyBEntityId : bodyAEntityId;
    const holdable = game.entities.holdable[holdableEntityId];
    const { heldBy } = holdable;
    if (!heldBy) return;
    if (heldBy.id === otherBodyEntityId) return;
    // this should simulate the holdable being hard to hold in the desired location after a collision
    if (holdable.grips.a) holdable.grips.a.stiffness = 0.1;
    if (holdable.grips.b) holdable.grips.b.stiffness = 0.1;
    setTimeout(() => {
      if (holdable.grips.a) holdable.grips.a.stiffness = 1;
      if (holdable.grips.b) holdable.grips.b.stiffness = 1;
    }, 500);
    pair.isSensor = false;
  }
}
