import Round from "./round";
import { lerp, factorBetween, clamp, Vector2, randomNumber } from "../utils";
import GameObject, { Shapes } from "./gameObject";
import Player from "./player";

const xPadding = 48;
let mousePosition = { x: 0, y: 0 };

export default class Ball {
	gameObject: GameObject;
	round: Round;
	velocity: Vector2;

	constructor(round: Round) {
		const canvas = round.canvas;

		this.gameObject = new GameObject(
			new Vector2(canvas.width / 2, canvas.height / 2),
			new Vector2(26, 26),
			Shapes.Circle
		);
		this.round = round;
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
					} else if (playerPos.x > width / 2 && velocity.x > 0) {
						// touching player on right side of map
						//velocity.x *= -1;
						this.randomVelocity(-1);
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
	}

	randomVelocity(direction: -1 | 1) {
		const x = randomNumber(850, 1200) * direction;

		const rand = randomNumber(0, 1);
		const is = rand === 0 ? -1 : 1;
		const y = randomNumber(650, 900) * is;
		console.log(rand, is, y);
		this.velocity = new Vector2(x, y);
	}

	reset() {
		this.velocity = new Vector2(0, 0);
		this.gameObject.position = new Vector2(this.round.canvas.width / 2, this.round.canvas.height / 2);
	}

	tick(deltaTime: number) {
		this.update(deltaTime);
	}

	render(context: CanvasRenderingContext2D) {
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
