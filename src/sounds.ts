const Sounds: { [key: string]: HTMLAudioElement } = {
	Bounce: new Audio("./audio/ballbounce.wav"),
	Score: new Audio("./audio/score.mp3"),
	Loss: new Audio("./audio/loss.mp3"),
};

Sounds.Bounce.volume = 0.3;

export function PlaySound(name: string) {
	try {
		Sounds[name].play();
	} catch (err) {
		console.warn(`Failed to play sound ${name}:`);
		console.warn(err);
	}
}
