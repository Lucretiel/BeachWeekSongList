import plistlib
import re
import sys
import json
import argparse
from collections import namedtuple
from os import path


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


class ParseError(Exception):
    pass


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

    for playlist in data['Playlists']:
        for item in playlist['Playlist Items']:
            try:
                song = extract_song(item, special, source)
            except ParseError:
                pass
            else:
                yield song


def extract_all(special_files, files):
    for special_file in special_files:
        yield from extract_file(special_file, True)

    for normal_file in files:
        yield from extract_file(normal_file, False)


def filter_extracted_songs(songs, dedup):
    if dedup:
        key = lambda song: (song.title, song.artist, song.source)
    else:
        key = lambda song: song.id

    seen = set()

    for song in songs:
        k = key(song)
        if k not in seen:
            yield song
            seen.add(k)


def write_iterable_json(it, ostr):
    '''
    This function sequentially writes an iterable as a json list, without
    requiring it to be unrolled into a full list first.
    '''
    it = iter(it)
    dump = json.dump
    write = ostr.write
    write('[')

    count = 0

    try:
        dump(next(it), ostr)
        count += 1
    except StopIteration:
        pass

    for thing in it:
        write(',')
        dump(thing, ostr)
        count += 1

    write(']')
    return count


parser = argparse.ArgumentParser()
parser.add_argument('-s', '--strm-file', action='append')
parser.add_argument('-f', '--normal-file', action='append')
parser.add_argument('-d', '--deduplicate', action='store_true')


def main():
    args = parser.parse_args()
    songs = extract_all(args.strm_file, args.normal_file)
    songs = filter_extracted_songs(songs, args.deduplicate)
    songs = map(Song._asdict, songs)
    count = write_iterable_json(songs, sys.stdout)
    message("Song list parsed: found {} songs".format(count))

if __name__ == '__main__':
    main()
