import plistlib
import logging
import re
import sys
import json
from os import path

from autocommand import autocommand


artist_title_matchers = [
    re.compile(r"^.* - (?P<artist>.*) - (?P<title>.*)$"),
    re.compile(r"^(?P<artist>.*) - (?P<title>.*) \[.*\]$", re.I),
    re.compile(r"^(?P<artist>.*) - (?P<title>.*)$"),
    re.compile(r"^(?P<artist>.*)-(?P<title>.*) \[.*\]$", re.I),
    re.compile(r"^(?P<artist>.*)-(?P<title>.*)$"),
]

bad_titles = [
    re.compile(r"^SC[0-9]{4}-[0-9]{2}$", re.I),
    re.compile(r"^Track [0-9]+", re.I)
]

def load_music_file(filename):
    with open(filename, 'rb') as file:
        return plistlib.load(file)


class ParseError(Exception):
    pass


seen_ids = {}


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

def extract_songs(data, source, need_strm):
    source = path.basename(source)
    playlists = data['Playlists']
    for playlist in playlists:
        items = playlist['Playlist Items']
        for item in items:
            song_id = item['soID']
            if song_id in seen_ids:
                logging.error(
                    "Duplicate song id '%s' (Current title: %s, Original title: %s)",
                    song_id, item.get('name', ""), seen_ids[song_id])
                continue
            else:
                seen_ids[song_id] = item.get('name', "")

            try:
                title = item['name']
            except KeyError:
                logging.error("Song with id %s has no title", song_id)
                continue

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

            yield {
                'title': title,
                'artist': artist,
                'id': song_id,
                'disabled': disabled,
                'source': source
            }


def extract_file(filename, special):
    data = load_music_file(filename)
    yield from extract_songs(data, filename, special)


def extract_all(special_file, files):
    if special_file is not None:
        yield from extract_file(special_file, True)

    for normal_file in files:
        yield from extract_file(normal_file, False)


@autocommand(__name__)
def main(special_file=None, *files):
    logging.basicConfig(level=logging.INFO)
    json.dump(list(extract_all(special_file, files)), sys.stdout)
