import Round from "./round";
import GameObject, { Shapes } from "./gameObject";
import { lerp, factorBetween, clamp, Vector2, randomNumber } from "../utils";

let mousePosition = { x: 0, y: 0 };

export default class Player {
	round: Round;
	isAi: boolean;
	gameObject: GameObject;
	score: number;

	constructor(round: Round, xPos: number, isAi: boolean) {
		const canvas = round.canvas;

		this.round = round;
		this.isAi = isAi;

		this.score = 0;

		this.gameObject = new GameObject(new Vector2(xPos, canvas.height / 2), new Vector2(6, 128), Shapes.Box);
	}

	reset() {
		this.gameObject.position.y = this.round.canvas.height / 2;
	}

	tickControls() {
		const size = this.gameObject.size;
		const canvas = this.round.canvas;
		const canvasAbsoluteHeight = canvas.getBoundingClientRect().height;
		const paddingHeight = (window.innerHeight - canvasAbsoluteHeight) / 2;
		const factor = factorBetween(
			paddingHeight + size.y / 2,
			paddingHeight + canvasAbsoluteHeight - size.y / 2,
			mousePosition.y
		);
		const scale = clamp(factor, 0, 1);
		this.gameObject.position.y = scale * (canvas.height - size.y) + size.y / 2;
	}

	tickAi() {
		const SPEED = 7;
		const THRESHOLD = 5;

		if (this.round.ball.gameObject.position.x < this.round.canvas.width * 0.55 || this.round.ball.velocity.x < 0)
			return;

		const pos = this.gameObject.position;
		const actualDiff = this.round.ball.lastPredictedY - pos.y;
		const diff = clamp(actualDiff, -SPEED, SPEED);
		if (diff < THRESHOLD && diff > -THRESHOLD) return;

		pos.y = lerp(pos.y, pos.y + diff, 0.8);
	}

	tick() {
		if (!this.isAi) {
			this.tickControls();
		} else {
			this.tickAi();
		}
	}

	render(context: CanvasRenderingContext2D) {
		context.fillStyle = "white";
		this.gameObject.render(context);
	}
}

window.addEventListener("mousemove", (event) => {
	mousePosition = { x: event.clientX, y: event.clientY };
});
