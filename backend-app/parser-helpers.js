export function justText(el) {
	return el.clone()
		.children()
		.remove()
		.end()
		.text();
}