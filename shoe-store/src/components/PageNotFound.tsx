export function PageNotFound() {
	const messages = [
		'How about we explore that area ahead of us later?',
		'S-S-So cold... M-Maybe we... Sh-Should look for another way up the mountain...',
		`There's nothing here. Should we go back first?`,
		`It's just rock wall after rock wall in here. It'll take us ages to get back to the surface. Why don't we just use the crane instead?`,
	];

	return (
		<>
			<img
				src="/images/404.png"
				alt="Emergency food says"
			></img>
			<h2>{messages[Math.round(Math.random() * 999) % 4]}</h2>
		</>
	);
}
