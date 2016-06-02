dev: dist/bundle.js

prod: dist.prod/bundle.js

SRC_FILES = $(shell find src -type f -iname '*.jsx') ./src/style.css ./favicon.png
MUSIC_FILES = $(shell find songs -type f -iname '*.xml')

clean:
	rm -rf src/data dist dist.prod

dist/bundle.js: $(SRC_FILES) src/data/songlist.json webpack.config.js package.json
	./node_modules/webpack/bin/webpack.js -d --config webpack.config.js

dist.prod:
	git clone http://github.com/Lucretiel/BeachWeekSongList dist.prod -b gh-pages --single-branch

dist.prod/bundle.js: $(SRC_FILES) src/data/songlist.json webpack.config.js webpack.config.prod.js package.json dist.prod
	./node_modules/webpack/bin/webpack.js -p --devtool source-map --config webpack.config.prod.js

src/data:
	mkdir src/data

src/data/songlist.json: $(MUSIC_FILES) parse_song_lists.py src/data
	python3 parse_song_lists.py -d -s songs/TriceraSoft.xml songs/Library.xml songs/KaraokeCloud.xml > src/data/songlist.json
