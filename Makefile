dev: dist/bundle.js

prod: dist.prod/bundle.js

SRC_FILES = $(shell find src -type f -iname '*.jsx')
MUSIC_FILES = $(shell find songs -type f -iname '*.xml')

dist/bundle.js: $(SRC_FILES) src/songlist.json webpack.config.js package.json
	./node_modules/webpack/bin/webpack.js -d --config webpack.config.js

dist.prod/bundle.js: $(SRC_FILES) src/songlist.json webpack.config.prod.js package.json
	./node_modules/webpack/bin/webpack.js -p --devtool source-map --config webpack.config.prod.js

src/songlist.json: $(MUSIC_FILES) parse_song_lists.py
	python3 parse_song_lists.py -d -s songs/TriceraSoft.xml songs/Library.xml songs/KaraokeCloud.xml > src/songlist.json
