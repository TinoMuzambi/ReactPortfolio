export const getY = (currY) => {
	return currY > 33
		? ((window.innerHeight / 0.68) * 33 * 3) / 100
		: ((window.innerHeight / 0.68) * currY * 3) / 100;
};

export const getX = (currX) => {
	return currX > 33
		? (window.innerWidth / 2.15) * ((33 * 3) / 100)
		: (window.innerWidth / 2.15) * ((currX * 3) / 100);
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
