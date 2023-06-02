import Round, { States } from "./round";
import { lerp, factorBetween, clamp, Vector2, randomNumber } from "../utils";
import GameObject, { Shapes } from "./gameObject";
import Player from "./player";
import { PlaySound } from "../sounds";

const xPadding = 48;
let mousePosition = { x: 0, y: 0 };

export default class Ball {
	gameObject: GameObject;
	round: Round;
	velocity: Vector2;
	lastPredictedTime: number;
	lastPredictedY: number;
	lastPredictedX: number;

	constructor(round: Round) {
		const canvas = round.canvas;

		this.gameObject = new GameObject(
			new Vector2(canvas.width / 2, canvas.height / 2),
			new Vector2(26, 26),
			Shapes.Circle
		);
		this.round = round;
		this.lastPredictedTime = performance.now();
		this.lastPredictedY = canvas.height / 2;
		this.lastPredictedX = canvas.width - 42;
		this.velocity = new Vector2(0, 0);
		this.reset();
	}

	update(deltaTime: number) {
		const gameObject = this.gameObject;

		gameObject.position = gameObject.position.add(this.velocity.multiply(deltaTime));

		const position = gameObject.position;
		const size = gameObject.size;
		const velocity = this.velocity;
		const width = this.round.canvas.width;
		const height = this.round.canvas.height;

		// Bottom
		if (position.y > height - size.y / 2) {
			if (velocity.y > 0) {
				velocity.y *= -1;
			}
		}

		// Top
		if (position.y < 0 + size.y / 2) {
			if (velocity.y < 0) {
				velocity.y *= -1;
			}
		}

		// Left
		if (position.x < 0 + size.x / 2) {
			if (velocity.x < 0) {
				//velocity.x *= -1;
				this.round.reset(this.round.player2);
			}
		}

		// Right
		if (position.x > width - size.y / 2) {
			if (velocity.x > 0) {
				//velocity.x *= -1;
				this.round.reset(this.round.player1);
			}
		}

		// Left paddle
		const checkPlayerCollision = (player: Player) => {
			const playerPos = player.gameObject.position;
			const playerSize = player.gameObject.size;

			const extraHeight = 22;
			const playerTopY = playerPos.y - playerSize.y / 2;
			const playerBottomY = playerPos.y + playerSize.y / 2;
			if (position.y > playerTopY - extraHeight && position.y < playerBottomY + extraHeight) {
				const xDistance = Math.abs(position.x - playerPos.x);
				if (xDistance < playerSize.x / 2 + size.x / 2) {
					if (playerPos.x < width / 2 && velocity.x < 0) {
						// touching player on left side of map
						//velocity.x *= -1;
						this.randomVelocity(1);
						PlaySound("Bounce");
					} else if (playerPos.x > width / 2 && velocity.x > 0) {
						// touching player on right side of map
						//velocity.x *= -1;
						this.randomVelocity(-1);
						PlaySound("Bounce");
					}
				}
			}
		};

		checkPlayerCollision(this.round.player1);
		checkPlayerCollision(this.round.player2);
	}

	start() {
		const xDir = Math.round(randomNumber(0, 1)) == 0 ? -1 : 1;
		const yDir = Math.round(randomNumber(0, 1)) == 0 ? -1 : 1;
		this.velocity = new Vector2(800 * xDir, 500 * yDir);

		// DEBUG PREDICTION
		//this.gameObject.position = new Vector2(1700, 950);
		//this.velocity = new Vector2(400, 500);
	}

	randomVelocity(direction: -1 | 1) {
		const x = randomNumber(850, 1200) * direction;

		const rand = randomNumber(0, 1);
		const is = rand === 0 ? -1 : 1;
		const y = randomNumber(650, 900) * is;
		this.velocity = new Vector2(x, y);
	}

	reset() {
		this.velocity = new Vector2(0, 0);
		this.gameObject.position = new Vector2(this.round.canvas.width / 2, this.round.canvas.height / 2);
	}

	tick(deltaTime: number) {
		//if (this.gameObject.position.x > this.round.canvas.width * 0.9) return;
		this.update(deltaTime);
	}

	predictPosition(context: CanvasRenderingContext2D) {
		if (performance.now() - this.lastPredictedTime < 20) return;
		this.lastPredictedTime = performance.now();

		const width = this.round.canvas.width;
		const height = this.round.canvas.height;
		let pos = this.gameObject.position.clone();
		let vel = this.velocity.clone();

		const distance = () => {
			return this.round.player2.gameObject.position.x - pos.x;
		};

		let tries = 0;

		while (true) {
			const dist = distance();
			if (dist < this.gameObject.size.x / 2) break;
			if (tries > 500) break;
			if (pos.x > 2500) break;
			tries += 1;

			pos = pos.add(vel.multiply(0.005));

			// Bottom
			if (pos.y > height - this.gameObject.size.y / 2) {
				if (vel.y > 0) {
					vel.y *= -1;
				}
			}

			// Top
			if (pos.y < 0 + this.gameObject.size.y / 2) {
				if (vel.y < 0) {
					vel.y *= -1;
				}
			}
		}

		//console.log(pos);
		this.lastPredictedY = pos.y;
		this.lastPredictedX = Math.min(pos.x, 1900); //this.round.canvas.width - 42;
	}

	drawDot(color: string, x: number, y: number, size: number) {
		const context = this.round.canvas.getContext("2d") as CanvasRenderingContext2D;
		context.fillStyle = color;
		context.fillRect(x - size / 2, y - size / 2, size, size);
	}

	render(context: CanvasRenderingContext2D) {
		if (this.round.state == States.Playing) {
			this.predictPosition(context);

			/*
			this.drawDot("purple", this.lastPredictedX, this.lastPredictedY, 16);

			context.beginPath();
			context.moveTo(this.gameObject.position.x, this.gameObject.position.y);
			const to = this.gameObject.position.add(this.velocity);
			context.lineTo(to.x, to.y);
			context.fillStyle = "white";
			context.stroke();
			*/
		}

		context.fillStyle = "white";
		this.gameObject.render(context);
	}
}

export const Sides = {
	Left: 1,
	Right: 2,
};

window.addEventListener("mousemove", (event) => {
	mousePosition = { x: event.clientX, y: event.clientY };
});
