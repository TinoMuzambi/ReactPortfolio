const CircularLoader = () => {
	return (
		<div className="demo-3 loading">
			<main>
				<svg class="circles" width="100%" height="100%" viewBox="0 0 1400 1400">
					<def>
						<path
							id="circle-1"
							d="M250,700.5A450.5,450.5 0 1 11151,700.5A450.5,450.5 0 1 1250,700.5"
						/>
						<path
							id="circle-2"
							d="M382,700.5A318.5,318.5 0 1 11019,700.5A318.5,318.5 0 1 1382,700.5"
						/>
						<path
							id="circle-3"
							d="M487,700.5A213.5,213.5 0 1 1914,700.5A213.5,213.5 0 1 1487,700.5"
						/>
						<path
							id="circle-4"
							d="M567.5,700.5A133,133 0 1 1833.5,700.5A133,133 0 1 1567.5,700.5"
						/>
					</def>
					<text class="circles__text circles__text--1">
						<textPath
							class="circles__text-path"
							xlink:href="#circle-1"
							aria-label=""
							textLength="2830"
						>
							Let life begin I've cleansed all my sins&nbsp;
						</textPath>
					</text>
					<text class="circles__text circles__text--2">
						<textPath
							class="circles__text-path"
							xlink:href="#circle-2"
							aria-label=""
							textLength="2001"
						>
							Burn all the money absolve all the lies&nbsp;
						</textPath>
					</text>
					<text class="circles__text circles__text--3">
						<textPath
							class="circles__text-path"
							xlink:href="#circle-3"
							aria-label=""
							textLength="1341"
						>
							We are caged in simulations&nbsp;
						</textPath>
					</text>
					<text class="circles__text circles__text--4">
						<textPath
							class="circles__text-path"
							xlink:href="#circle-4"
							aria-label=""
							textLength="836"
						>
							But something has changed in us&nbsp;
						</textPath>
					</text>
				</svg>
			</main>
		</div>
	);
};

export default CircularLoader;
