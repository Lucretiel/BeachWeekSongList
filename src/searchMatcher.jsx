import _ from 'underscore'

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

	let match;

	while((match = tokenRegex.exec(text)) !== null) {
		let matchText = match[1] || match[2];

		if (matchText) {
			if ((match = artistRegex.exec(matchText)) !== null) {
				if (match[2]) artists.push(match[2]);
			} else if ((match = titleRegex.exec(matchText)) !== null) {
				if (match[2]) titles.push(match[1]);
			} else {
				generics.push(matchText);
			}
		}
	}

	function makeMatcher(tokens, token_matcher) {
		return tokens.length ?
			song => _.all(tokens, token => token_matcher(song, token)) :
			song => true;
	}

	const generic_matcher = makeMatcher(generics, (song, blob) =>
		song.title.includes(blob) || song.artist.includes(blob))
	const artist_matcher = makeMatcher(artists, (song, artist) =>
		song.artist.includes(artist))
	const title_matcher = makeMatcher(titles, (song, title) =>
		song.title.includes(title))

	return song => generic_matcher(song) && artist_matcher(song) && title_matcher(song)
}



