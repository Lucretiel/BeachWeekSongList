.PHONY: dev prod clean megaclean

SRC_FILES = $(shell find src -type f -iname '*.jsx') ./src/style.css ./favicon.png
MUSIC_FILES = $(shell find songs -type f -iname '*.xml')

WEBPACK = ./node_modules/.bin/webpack

dev: dist/bundle.js

prod: dist.prod/bundle.js

dist/bundle.js: $(SRC_FILES) \
	src/data/songlist.json \
	webpack.config.js \
	package.json \
	node_modules

	$(WEBPACK) -d --config webpack.config.js

dist.prod:
	git clone http://github.com/Lucretiel/BeachWeekSongList dist.prod -b gh-pages --single-branch

dist.prod/bundle.js: $(SRC_FILES) \
	src/data/songlist.json \
	webpack.config.js \
	webpack.config.prod.js \
	package.json \
	dist.prod \
	node_modules

	$(WEBPACK) -p --devtool source-map --config webpack.config.prod.js

src/data:
	mkdir src/data

src/data/songlist.json: $(MUSIC_FILES) parse_song_lists.py src/data
	python3 parse_song_lists.py -d \
		-s songs/TriceraSoft.xml \
		-f songs/Library.xml \
		-f songs/KaraokeCloud.xml \
		> src/data/songlist.json.temp
	mv src/data/songlist.json.temp src/data/songlist.json

node_modules:
	npm install

clean:
	rm -rf src/data dist dist.prod

megaclean: clean
	rm -rf node_modules
