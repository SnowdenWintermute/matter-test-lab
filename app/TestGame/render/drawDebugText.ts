import { roundedStringifiedVector } from "@/app/utils";
import { TestGame } from "..";
import { WidthAndHeight } from "../common-classes";

let maxYVel = 0;
let maxXVel = 0;

export default function drawDebugText(context: CanvasRenderingContext2D, canvasSize: WidthAndHeight, game: TestGame) {
  const entityExperiencingTraumaMeta = Object.values(game.entities.experiencingTrauma)[0];
  const entityExperiencingTrauma = game.entities.playerControlled[entityExperiencingTraumaMeta?.id];

  const text = ["DEBUG: "];
  const margin = 18;

  context.fillStyle = `rgba(0,0,0,.5)`;
  context.fillRect(0, 0, canvasSize.width, margin + text.length * margin);
  context.fillStyle = "white";
  context.textAlign = "left";
  context.textBaseline = "top";
  text.forEach((string, i) => {
    context.fillText(string, margin, margin + i * margin);
  });
}
