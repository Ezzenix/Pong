import Round, { States } from "./round";
import { lerp, factorBetween, clamp, Vector2, randomNumber } from "../utils";
import GameObject, { Shapes } from "./gameObject";
import Player from "./player";
import { PlaySound } from "../sounds";
import { BallSize, CanvasHeight, CanvasWidth } from "../constants";

const xPadding = 48;
let mousePosition = { x: 0, y: 0 };

export default class Ball {
	gameObject: GameObject;
	round: Round;
	velocity: Vector2;
	lastPredictedTime: number;
	lastPredictedY: number;
	bounces: number;

	constructor(round: Round) {
		this.gameObject = new GameObject(
			new Vector2(CanvasWidth / 2, CanvasHeight / 2),
			new Vector2(BallSize, BallSize),
			Shapes.Circle
		);
		this.round = round;
		this.lastPredictedTime = performance.now();
		this.lastPredictedY = CanvasHeight / 2;
		this.velocity = new Vector2(0, 0);
		this.bounces = 0;
		this.reset();
	}

	update(deltaTime: number) {
		const gameObject = this.gameObject;

		const speedMultiplier = 1 + this.bounces * 0.025;
		gameObject.position = gameObject.position.add(this.velocity.multiply(deltaTime).multiply(speedMultiplier));

		const position = gameObject.position;
		const size = gameObject.size;
		const velocity = this.velocity;

		// Bottom
		if (position.y > CanvasHeight - size.y / 2) {
			if (velocity.y > 0) {
				velocity.y *= -1;
				PlaySound("Bounce");
			}
		}

		// Top
		if (position.y < 0 + size.y / 2) {
			if (velocity.y < 0) {
				velocity.y *= -1;
				PlaySound("Bounce");
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
		if (position.x > CanvasWidth - size.y / 2) {
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
					if (playerPos.x < CanvasWidth / 2 && velocity.x < 0) {
						// touching player on left side of map
						this.randomVelocity(1);
						this.bounces += 1;
						PlaySound("Bounce");

						setTimeout(() => this.predictPosition(), 50);
					} else if (playerPos.x > CanvasWidth / 2 && velocity.x > 0) {
						// touching player on right side of map
						this.randomVelocity(-1);
						this.bounces += 1;
						PlaySound("Bounce");

						setTimeout(() => this.predictPosition(), 50);
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

		this.predictPosition();
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
		this.gameObject.position = new Vector2(CanvasWidth / 2, CanvasHeight / 2);
		this.bounces = 0;
	}

	tick(deltaTime: number) {
		this.update(deltaTime);

		//if (this.round.state == States.Playing) {
		//	this.predictPosition();
		//}
	}

	predictPosition() {
		//if (performance.now() - this.lastPredictedTime < 100) return;
		this.lastPredictedTime = performance.now();

		let pos = this.gameObject.position.clone();
		let vel = this.velocity.clone();

		const player = vel.x > 0 ? this.round.player2 : this.round.player1; // the player on the side which the ball is heading

		const getDistance = () => {
			return Math.abs(player.gameObject.position.x - pos.x);
		};

		let tries = 0;

		while (true) {
			const distance = getDistance();
			if (distance < BallSize / 2) break;
			if (tries > 500) break;
			tries += 1;

			pos = pos.add(vel.multiply(0.005));

			// Bottom
			if (pos.y > CanvasHeight - BallSize / 2) {
				if (vel.y > 0) {
					vel.y *= -1;
				}
			}

			// Top
			if (pos.y < 0 + BallSize / 2) {
				if (vel.y < 0) {
					vel.y *= -1;
				}
			}
		}

		//console.log(pos);
		this.lastPredictedY = pos.y;
	}

	render() {
		const ctx = this.round.context;
		ctx.fillStyle = "white";
		this.gameObject.render(ctx);
	}
}

export const Sides = {
	Left: 1,
	Right: 2,
};

window.addEventListener("mousemove", (event) => {
	mousePosition = { x: event.clientX, y: event.clientY };
});
