import Player from "./player";
import Ball from "./ball";
import { PlaySound } from "../sounds";

export default class Round {
	player1: Player;
	player2: Player;
	ball: Ball;
	canvas: HTMLCanvasElement;
	lastTick: number;
	state: number;

	constructor() {
		this.canvas = document.getElementById("canvas") as HTMLCanvasElement;

		this.player1 = new Player(this, 42, false);
		this.player2 = new Player(this, this.canvas.width - 42, true);
		this.ball = new Ball(this);

		this.state = States.Ready;

		this.lastTick = performance.now();
	}

	triggerStart() {
		if (this.state != States.Ready) return;
		this.state = States.Playing;

		this.ball.start();
	}

	reset(winner: Player) {
		if (this.state != States.Playing) return;
		this.state = States.Ready;

		if (winner == this.player1) {
			PlaySound("Score");
		} else {
			PlaySound("Loss");
		}

		winner.score += 1;

		this.player1.reset();
		this.player2.reset();
		this.ball.reset();
	}

	tick() {
		const context = this.canvas.getContext("2d");
		if (!context) return;

		const deltaTime = (performance.now() - this.lastTick) / 1000;
		this.lastTick = performance.now();

		const width = this.canvas.width;
		const height = this.canvas.height;

		// Clear the canvas
		context.fillStyle = "#0c0c0f";
		context.fillRect(0, 0, width, height);

		if (this.state == States.Ready) {
			// Press any key to start
			context.font = "42px Comic Sans MS";
			context.fillStyle = "white";
			context.textAlign = "center";
			context.fillText("Press any key to start", width / 2, 240);
		}
		// Score
		context.font = "38px Comic Sans MS";
		context.fillStyle = "white";
		context.textAlign = "right";
		context.fillText(this.player1.score.toString(), width / 2 - 62, 72);
		context.textAlign = "left";
		context.fillText(this.player2.score.toString(), width / 2 + 62, 72);

		// Middle Line
		const middleLineWidth = 2;
		context.fillStyle = "white";
		context.globalAlpha = 0.025;
		context.fillRect(width / 2 - middleLineWidth / 2, 0, middleLineWidth, height);
		context.globalAlpha = 1;

		// Tick
		if (this.state == States.Playing) {
			this.player1.tick();
			this.player2.tick();
			this.ball.tick(deltaTime);
		}

		// Render
		this.player1.render(context);
		this.player2.render(context);
		this.ball.render(context);
	}
}

export const States = {
	Playing: 1,
	Ready: 2,
};
