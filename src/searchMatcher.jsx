import all from 'lodash.every'
import flow from 'lodash.flow'

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

	const makeMatcher = (tokens, token_matcher) => prev_matcher =>
		tokens.length ?
			prev_matcher === null ?
				(title, artist) => all(tokens, token => token_matcher(title, artist, token)) :
				(title, artist) => prev_matcher(title, artist) && all(tokens, token => token_matcher(title, artist, token)) :
			prev_matcher

	if (generics.length + artists.length + titles.length === 0) {
		return song => true
	}

	return flow(
		makeMatcher(generics,
			(title, artist, blob) => title.includes(blob) || artist.includes(blob)),
		makeMatcher(artists,
			(title, artist, blob) => artist.includes(blob)),
		makeMatcher(titles,
			(title, artist, blob) => title.includes(blob)),
		matcher => song => matcher(song.title.toLowerCase(), song.artist.toLowerCase())
	)(null)
}



