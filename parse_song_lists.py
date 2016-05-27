import plistlib
import re
import sys
import json
from collections import namedtuple
from functools import wraps
from os import path

from autocommand import autocommand


def message(*args, **kwargs):
    print(*args, file=sys.stderr, flush=True, **kwargs)

artist_title_matchers = [
    re.compile(r"^.* - (?P<artist>.*) - (?P<title>.*)$"),
    re.compile(r"^(?P<artist>.*) - (?P<title>.*)$"),
    re.compile(r"^(?P<artist>.*)-(?P<title>.*)$"),
]

bad_titles = [
    re.compile(r"^SC[0-9]{4}-[0-9]{2}$", re.I),
    re.compile(r"^Track [0-9]+", re.I)
]


def load_music_file(filename):
    with open(filename, 'rb') as file:
        return plistlib.load(file)


Song = namedtuple('Song', 'title artist id disabled source')


class ParseError(Exception): pass


def check_bad_title(title, artist):
    # Double check: if the TITLE is some fucked up thing, try to
    # extract from the artist.
    for bad_matcher in bad_titles:
        if bad_matcher.match(title):
            for matcher in artist_title_matchers:
                match = matcher.match(artist)
                if match:
                    return match.group('title'), match.group('artist')

    return title, artist


def extract_song(item, need_strm, source):
    song_id = item['soID']
    try:
        title = item['name']
    except KeyError:
        message("Song with id {} has no title".format(song_id))
        raise ParseError()

    try:
        artist = item['arts']
    except KeyError:
        # Try to get the artist from the combined name in the title
        for matcher in artist_title_matchers:
            match = matcher.match(title)
            if match:
                title = match.group('title')
                artist = match.group('artist')
                break
        else:
            artist = ""

    title, artist = check_bad_title(title, artist)

    if need_strm:
        strm = item.get('strm', 0)
        disabled = not bool(strm)
    else:
        disabled = False

    return Song(
        title=title,
        artist=artist,
        id=song_id,
        disabled=disabled,
        source=source)


def extract_file(filename, special):
    data = load_music_file(filename)
    source = path.basename(filename)
    playlists = data['Playlists']

    for playlist in playlists:
        items = playlist['Playlist Items']
        for item in items:
            try:
                song = extract_song(item, special, source)
            except ParseError:
                pass
            else:
                yield song


def extract_all(special_file, files):
    if special_file is not None:
        yield from extract_file(special_file, True)

    for normal_file in files:
        yield from extract_file(normal_file, False)


def filter_extracted_songs(songs, dedup):
    if dedup:
        key = lambda song: (song.title, song.artist, song.source)
    else:
        key = lambda song: song.id

    seen = {}

    for song in songs:
        k = key(song)
        if k not in seen:
            yield song
            seen[k] = song
        else:
            message("Ignored duplicate song\n\tOriginal: {}\n\tDuplicate:{}".format(seen[k], song))


@autocommand(__name__)
def main(special_file=None, deduplicate=False, *files):
    songs = extract_all(special_file, files)
    songs = filter_extracted_songs(songs, deduplicate)
    songs = [song._asdict() for song in songs]
    json.dump(songs, sys.stdout)
    message("Song list parsed: found {} songs".format(len(songs)))
