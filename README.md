# BeachWeekSongList
A simple, searchable list of songs for Beach Week Karaoke

## Reference

Makefile handles EVERYTHING related to building, including creating node_modules and cloning gh-pages for prod. All you have to do it `make`.

### Some useful commands

- Build for development: `make dev`
- Build for production: `make prod`
  - Note that this does a clone of this repo's gh-pages branch to build the site into
