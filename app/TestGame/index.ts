import Matter from "matter-js";
import { MobileEntity } from "./MobileEntity";
import { Entity } from "./Entity";
import { CSPlayerInputState } from "./CSInputState";

export class CSEntities {
  playerControlled: { [id: number]: MobileEntity } = {};
  mobile: { [id: number]: MobileEntity } = {};
  static: { [id: number]: Entity } = {};
}

export class TestGame {
  physicsEngine: Matter.Engine = Matter.Engine.create();
  intervals: {
    physics: NodeJS.Timeout | undefined;
    render: NodeJS.Timeout | undefined;
  } = { physics: undefined, render: undefined };
  entities = new CSEntities();
  inputState = new CSPlayerInputState();
  renderRate = 33;

  clearPhysicsInterval() {
    clearTimeout(this.intervals.physics);
    this.intervals.physics = undefined;
  }

  stepGame(context: CanvasRenderingContext2D) {
    this.intervals.physics = setTimeout(() => {
      Object.values(this.entities.playerControlled).forEach((entity) => {
        context.fillStyle = "#234890";
        context.beginPath();
        entity.body.vertices.forEach((vertex, i) => {
          if (i === 0) context.moveTo(vertex.x, vertex.y);
          else context.lineTo(vertex.x, vertex.y);
        });
        context.closePath();
        context.fill();
      });
      this.stepGame(context);
    }, this.renderRate);
  }
}
