export class Vector3 {
	x: number;
	y: number;
	z: number;

	constructor(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	add(other: Vector3): Vector3 {
		return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
	}

	subtract(other: Vector3): Vector3 {
		return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
	}

	multiply(factor: number): Vector3 {
		return new Vector3(this.x * factor, this.y * factor, this.z * factor);
	}

	lerp(other: Vector3, t: number): Vector3 {
		return new Vector3(lerp(this.x, other.x, t), lerp(this.y, other.y, t), lerp(this.z, other.z, t));
	}

	isEqual(other: Vector3): boolean {
		return this.x == other.x && this.y == other.y && this.z == other.z;
	}
}

export class Vector2 {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	add(other: Vector2): Vector2 {
		return new Vector2(this.x + other.x, this.y + other.y);
	}

	subtract(other: Vector2): Vector2 {
		return new Vector2(this.x - other.x, this.y - other.y);
	}

	multiply(factor: number): Vector2 {
		return new Vector2(this.x * factor, this.y * factor);
	}

	lerp(other: Vector2, t: number): Vector2 {
		return new Vector2(lerp(this.x, other.x, t), lerp(this.y, other.y, t));
	}

	isEqual(other: Vector2): boolean {
		return this.x == other.x && this.y == other.y;
	}
}

export function randomNumber(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export function lerp(a: number, b: number, t: number): number {
	return a + t * (b - a);
}

export function factorBetween(min: number, max: number, num: number): number {
	return (num - min) / (max - min);
}

export function clamp(num: number, min: number, max: number): number {
	return Math.min(Math.max(num, min), max);
}
