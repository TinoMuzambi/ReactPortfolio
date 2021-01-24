export const getY = (currY) => {
	// first number is vertical positioning. Higher number, higher position on screen.
	// second number is speed of movement.
	return currY > 33
		? ((window.innerHeight / 0.64) * 33 * 3) / 100
		: ((window.innerHeight / 0.64) * currY * 3) / 100;
};

export const getX = (currX) => {
	// first number is horizontal positioning. Higher number, more left
	return currX > 33
		? (window.innerWidth / 2.58) * ((33 * 3) / 100)
		: (window.innerWidth / 2.58) * ((currX * 3) / 100);
};

export const getCurrentScroll = () => {
	const scrollPos =
		window.scrollY ||
		window.scrollTop ||
		document.getElementsByTagName("html")[0].scrollTop;

	const scrollOffset = (scrollPos / window.innerHeight) * 100;

	return parseFloat(scrollOffset).toFixed(0);
};

export const updateEls = () => {
	const transformButton = document.querySelector(".enter");
	const transformSVG = document.querySelector(".enter .icon");
	const items = [transformButton, transformSVG];

	let current = getCurrentScroll();
	items.forEach((el) => {
		el.style.transform = `translate(${getX(current)}px,${getY(
			current
		)}px) rotate(${180 * (current / 100)}deg`;
	});

	requestAnimationFrame(updateEls);
};
