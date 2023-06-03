import Round from "./classes/round";

const round = new Round();

function step() {
	if (round) {
		round.tick();
		round.render();
	}
	window.requestAnimationFrame(step);
}
window.requestAnimationFrame(step);

// Triggers
document.onkeydown = (e) => {
	round.triggerStart();
};
window.addEventListener("click", (e) => {
	round.triggerStart();
});
round.triggerStart();
