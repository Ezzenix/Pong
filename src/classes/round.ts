import Player from "./player";
import Ball from "./ball";
import { PlaySound } from "../sounds";
import { CanvasHeight, CanvasWidth, PlayerInset } from "../constants";

export default class Round {
	canvas: HTMLCanvasElement;
	context: CanvasRenderingContext2D;
	player1: Player;
	player2: Player;
	ball: Ball;
	lastTick: number;
	state: number;

	constructor() {
		this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
		this.canvas.width = CanvasWidth;
		this.canvas.height = CanvasHeight;
		this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
		this.context.shadowBlur = 7;
		this.context.shadowColor = "white";

		this.player1 = new Player(this, PlayerInset, true);
		this.player2 = new Player(this, CanvasWidth - PlayerInset, true);
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
		const deltaTime = (performance.now() - this.lastTick) / 1000;
		this.lastTick = performance.now();

		if (this.state == States.Playing) {
			this.player1.tick();
			this.player2.tick();
			this.ball.tick(deltaTime);
		}
	}

	render() {
		const ctx = this.context;

		// Draw background
		ctx.fillStyle = "#0c0c0f";
		ctx.fillRect(0, 0, CanvasWidth, CanvasHeight);
		const middleLineWidth = 2;
		ctx.fillStyle = "white";
		ctx.globalAlpha = 0.025;
		ctx.fillRect(CanvasWidth / 2 - middleLineWidth / 2, 0, middleLineWidth, CanvasHeight);
		ctx.globalAlpha = 1;

		// Text
		if (this.state == States.Ready) {
			// Press any key to start
			ctx.font = "42px Comic Sans MS";
			ctx.fillStyle = "white";
			ctx.textAlign = "center";
			ctx.fillText("Press any key to start", CanvasWidth / 2, 240);
		}
		// Score
		ctx.font = "38px Comic Sans MS";
		ctx.fillStyle = "white";
		ctx.textAlign = "right";
		ctx.fillText(this.player1.score.toString(), CanvasWidth / 2 - 62, 72);
		ctx.textAlign = "left";
		ctx.fillText(this.player2.score.toString(), CanvasWidth / 2 + 62, 72);

		// GameObjects
		this.player1.render();
		this.player2.render();
		this.ball.render();
	}
}

export const States = {
	Playing: 1,
	Ready: 2,
};
