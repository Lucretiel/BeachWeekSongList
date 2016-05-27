# BeachWeekSongList
A simple, searchable list of songs for Beach Week Karaoke

## Reference

### Some useful commands

- Build for development: `./node_modules/webpack/bin/webpack.js -d --config webpack.config.js`
- Build for production: `./node_modules/webpack/bin/webpack.js -p --config webpack.config.prod.js`
- Build for continuous development:

```
fswatch -0 src/ package.json webpack.config.js | while read -z event
    echo -s (set_color -b yellow) $event (set_color normal)
    ./node_modules/webpack/bin/webpack.js
end
```

- Build music files: `python3 parse_song_lists.py -s songs/TriceraSoft.xml songs/Library.xml songs/KaraokeCloud.xml > src/songlist.json`
