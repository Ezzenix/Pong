import { Vector2 } from "../utils";

export default class GameObject {
	position: Vector2;
	size: Vector2;
	shape: number;

	constructor(position: Vector2, size: Vector2, shape: number) {
		this.position = position;
		this.size = size;
		this.shape = shape;
	}

	render(ctx: CanvasRenderingContext2D) {
		const pos = this.position;
		const size = this.size;

		if (this.shape == Shapes.Circle) {
			const radius = Math.max(size.x, size.y) / 2;

			ctx.beginPath();
			ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
			ctx.fill();
		} else {
			ctx.fillRect(pos.x - size.x / 2, pos.y - size.y / 2, size.x, size.y);
		}
	}
}

export const Shapes = {
	Circle: 1,
	Box: 2,
};
