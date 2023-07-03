import { TestGame } from "..";
import { EntityCategory } from "../enums";

export default function determineHoldableCollisionPairEntities(pair: Matter.Pair, game: TestGame) {
  const { bodyA, bodyB } = pair;
  const [bodyACategory, bodyAEntityId] = bodyA.label.split("-").map((value) => Number(value));
  const [bodyBCategory, bodyBEntityId] = bodyB.label.split("-").map((value) => Number(value));
  if (bodyACategory !== EntityCategory.HOLDABLE && bodyBCategory !== EntityCategory.HOLDABLE) return;
  if (bodyACategory === EntityCategory.HOLDABLE && bodyBCategory === EntityCategory.HOLDABLE) return;

  const holdableEntityMeta = { id: bodyAEntityId, category: bodyACategory };
  const otherEntityMeta = { id: bodyBEntityId, category: bodyBCategory };

  if (bodyBCategory === EntityCategory.HOLDABLE) {
    holdableEntityMeta.id = bodyBEntityId;
    holdableEntityMeta.category = bodyBCategory;
    otherEntityMeta.id = bodyAEntityId;
    otherEntityMeta.category = bodyACategory;
  }

  const holdable = game.entities.holdable[holdableEntityMeta.id];
  const { heldBy } = holdable;

  if (!heldBy) return console.log("a holdable collision ended while no entity was holding it");
  if (heldBy.id === otherEntityMeta.id) return; // don't collide with the entity holding this item

  return { holdable, heldBy, otherEntityId: otherEntityMeta.id, otherEntityCategory: otherEntityMeta.category };
}
