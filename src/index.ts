import Round from "./classes/round";

const round = new Round();

function tick() {
	if (round) {
		round.tick();
	}
	window.requestAnimationFrame(tick);
}
window.requestAnimationFrame(tick);

document.onkeydown = (e) => {
	round.triggerStart();
};
window.addEventListener("click", (e) => {
	round.triggerStart();
});

round.triggerStart();
