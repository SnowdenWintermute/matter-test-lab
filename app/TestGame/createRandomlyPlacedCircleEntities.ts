import Matter from "matter-js";
import { TestGame } from ".";
import { Entity } from "./entities/Entity";

export default function createRandomlyPlacedCircleEntities(game: TestGame) {
  for (let i = 0; i < 20; i += 1) {
    const x = Math.random() * 500;
    const y = Math.random() * 500;
    const r = Math.random() * 30;
    const body = Matter.Bodies.circle(x, y, r);
    game.entities.static[i] = new Entity(i, body, 0, 0, {
      max: 1,
      current: 1,
    });
    Matter.Composite.add(game.physicsEngine.world, body);
  }
}
