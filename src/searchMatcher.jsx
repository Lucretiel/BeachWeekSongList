import all from 'lodash.every'

export default function SearchMatcher(text) {
	text = text.trim().toLowerCase()
	if (text === "") {
		return song => true;
	}

	/*
	These lists contain the substrings to be matched. In order to be a match,
	a song's title must have ALL of the title parts as substrings, all of the
	artist parts as substrings, and all of the generic parts in either the
	title or artist
	*/
	const generics = []
	const artists = []
	const titles = []

	const tokenRegex = /([^\s"]+)|"([^"]+)"/g
	const artistRegex = /^artist:\s*(([^\s].*)?)$/
	const titleRegex = /^title:\s*(([^\s].*)?)$/

	let regexMatch;

	while((regexMatch = tokenRegex.exec(text)) !== null) {
		let matchText = regexMatch[1] || regexMatch[2];

		if (matchText) {
			if ((regexMatch = artistRegex.exec(matchText)) !== null) {
				if (regexMatch[2]) artists.push(regexMatch[2]);
			} else if ((regexMatch = titleRegex.exec(matchText)) !== null) {
				if (regexMatch[2]) titles.push(regexMatch[1]);
			} else {
				generics.push(matchText);
			}
		}
	}

	const makeMatcher = (tokens, token_matcher, prev_matcher=null) =>
		tokens.length ?
			prev_matcher === null ?
				song => all(tokens, token => token_matcher(song, token)) :
				song => prev_matcher(song) && all(tokens, token => token_matcher(song, token)) :
			prev_matcher

	let matcher = null
	matcher = makeMatcher(generics, ((song, blob) =>
		song.title.includes(blob) || song.artist.includes(blob)), matcher)
	matcher = makeMatcher(artists, ((song, artist) =>
		song.artist.includes(artist)), matcher)
	matcher = makeMatcher(titles, ((song, title) =>
		song.title.includes(title)), matcher)

	return matcher === null ?
		song => true :
		song => matcher({
			title: song.title.toLowerCase(),
			artist: song.artist.toLowerCase(),
		})
}



