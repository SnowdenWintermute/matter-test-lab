import Matter from "matter-js";
import { Trauma } from "./Trauma";

export class Entity {
  id: number;
  body: Matter.Body;
  height: number;
  z: number;
  owner: string | undefined;
  hp: {
    max: number;
    current: number;
  };
  developingTraumas: { [sourceId: number]: Trauma } = {};
  constructor(id: number, body: Matter.Body, height: number, z: number, hp: { max: number; current: number }, owner?: string) {
    this.id = id;
    this.body = body;
    this.height = height;
    this.z = z;
    this.owner = owner;
    this.hp = hp;
  }
}
