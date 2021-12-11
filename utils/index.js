export const getHtml = (title, html) => {
	// Get html for sending email.
	return `
		<head>
			<title>${title} | ReComments</title>
			<meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
		</head>
		<header>
			<img src="https://a.storyblok.com/f/114267/1080x1080/b66aa450e5/recomments.png" alt="logo"/>
		</header>
		<main>
			${html}

			<div class="bar" />
		</main>
		<style>
			@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;400;700;900&display=swap");

			* {
				font-family: "Poppins", sans-serif;
			}

			header img {
				height: 100px;
			}

			body {
				padding: 2rem;
			}

			a {
				color: rgb(61, 166, 255);
			}

			b {
				color:  #ffa500;
			}

			blockquote {
				background: #f9f9f9;
				border-left: 10px solid #ccc;
				margin: 1.5em 10px;
				padding: 0.5em 10px;
				white-space: pre-wrap;
			}

			blockquote:before {
				color: #ccc;
				content: open-quote;
				font-size: 4em;
				line-height: .1em;
				margin-right: .25em;
				vertical-align: -.4em;
			}

			.bar {
				margin: 1rem 0;
				background: #ffa500;
				height: 2rem;
				width: 100%
			}
		</style>
	`;
};
