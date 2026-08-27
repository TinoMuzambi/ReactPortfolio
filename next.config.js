module.exports = {
	// Keep html-react-parser and its ESM-only dependency chain inside the server
	// bundle. Externalizing it breaks Pages Router ISR in Vercel's Node runtime.
	transpilePackages: ["html-react-parser"],
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "a.storyblok.com",
				pathname: "/**",
			},
		],
	},
};
