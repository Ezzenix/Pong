import Round from "./round";
import GameObject, { Shapes } from "./gameObject";
import { lerp, factorBetween, clamp, Vector2, randomNumber } from "../utils";
import { AI_SPEED, CanvasHeight, CanvasWidth, PlayerHeight, PlayerWidth } from "../constants";

let mousePosition = { x: 0, y: 0 };

export default class Player {
	round: Round;
	isAi: boolean;
	gameObject: GameObject;
	score: number;

	constructor(round: Round, xPos: number, isAi: boolean) {
		this.round = round;
		this.isAi = isAi;

		this.score = 0;

		this.gameObject = new GameObject(
			new Vector2(xPos, CanvasHeight / 2),
			new Vector2(PlayerWidth, PlayerHeight),
			Shapes.Box
		);
	}

	reset() {
		this.gameObject.position.y = CanvasHeight / 2;
	}

	tickControls() {
		const canvas = this.round.canvas;
		const canvasAbsoluteHeight = canvas.getBoundingClientRect().height;
		const paddingHeight = (window.innerHeight - canvasAbsoluteHeight) / 2;
		const factor = factorBetween(
			paddingHeight + PlayerHeight / 2,
			paddingHeight + canvasAbsoluteHeight - PlayerHeight / 2,
			mousePosition.y
		);
		const scale = clamp(factor, 0, 1);
		this.gameObject.position.y = scale * (CanvasHeight - PlayerHeight) + PlayerHeight / 2;
	}

	tickAi() {
		const THRESHOLD = 5;

		// Only move if the ball is close enough
		const xDistanceToBall = Math.abs(this.round.ball.gameObject.position.x - this.gameObject.position.x);
		if (xDistanceToBall > CanvasWidth * 0.25) return;

		// Only move if the ball is heading towards player
		const isLeftSide = this.gameObject.position.x < CanvasWidth / 2;
		if (isLeftSide && this.round.ball.velocity.x > 0) return;
		if (!isLeftSide && this.round.ball.velocity.x < 0) return;

		// Smoothly move Y towards predicted Y
		const pos = this.gameObject.position;
		const actualDiff = this.round.ball.lastPredictedY - pos.y;
		const diff = clamp(actualDiff, -AI_SPEED, AI_SPEED);
		if (diff < THRESHOLD && diff > -THRESHOLD) return; // prevent jittering
		const desiredY = lerp(pos.y, pos.y + diff, 0.8);

		// Limit and set the Y-value of position
		pos.y = clamp(desiredY, PlayerHeight / 2, CanvasHeight - PlayerHeight / 2);
	}

	tick() {
		if (!this.isAi) {
			this.tickControls();
		} else {
			this.tickAi();
		}
	}

	render() {
		const ctx = this.round.context;
		ctx.fillStyle = "white";
		this.gameObject.render(ctx);
	}
}

window.addEventListener("mousemove", (event) => {
	mousePosition = { x: event.clientX, y: event.clientY };
});
