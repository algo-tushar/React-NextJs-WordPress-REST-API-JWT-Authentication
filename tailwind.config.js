/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class', // Enable dark mode using class strategy
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				dark: '#1f2937',
			},
		},
	},
	plugins: [],
};