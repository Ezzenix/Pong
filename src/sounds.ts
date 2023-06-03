const Sounds: { [key: string]: { Element: HTMLAudioElement; Volume?: number } } = {
	Bounce: {
		Element: new Audio("./audio/ballbounce.wav"),
		Volume: 0.25,
	},
	Score: {
		Element: new Audio("./audio/score.mp3"),
		Volume: 1,
	},
	Loss: {
		Element: new Audio("./audio/loss.mp3"),
		Volume: 1,
	},
};

export function PlaySound(name: string, origin?: string) {
	try {
		const sound = Sounds[name];
		const element = sound.Element.cloneNode(true) as HTMLAudioElement;
		if (sound.Volume) {
			element.volume = sound.Volume;
		}
		element.play();
	} catch (err) {
		console.log(err);
	}
}
