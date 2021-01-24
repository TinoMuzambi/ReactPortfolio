export const getY = (currY) => {
	return currY > 33
		? ((window.innerHeight / 0.68) * 33 * 3) / 100
		: ((window.innerHeight / 0.68) * currY * 3) / 100;
};

export const getX = (currX) => {
	return currX > 33
		? (window.innerWidth / 2.3) * ((33 * 3) / 100)
		: (window.innerWidth / 2.3) * ((currX * 3) / 100);
};
