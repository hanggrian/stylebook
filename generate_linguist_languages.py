from json import dumps
from typing import Any
from urllib.request import urlopen

from yaml import safe_load

URL: str = \
    'https://raw.githubusercontent.com/github-linguist/linguist/master/lib/linguist/languages.yml'


def fetch_yaml(url: str) -> dict[str, Any]:
    with urlopen(url) as resp:
        return safe_load(resp.read())


def pick_shortest(name: str, lang: dict[str, Any]) -> str | None:
    candidates: list[str] = []
    aliases: list[str] | None = lang.get('aliases', [])
    if aliases:
        candidates.append(sorted(aliases, key=lambda s: (len(s), s))[0])
    extensions: list[str] | None = lang.get('extensions', [])
    if extensions:
        candidates.append(extensions[0].lstrip('.'))
    # prioritize candidate with the same language name
    for candidate in candidates:
        if candidate == name:
            return candidate
    return candidates[0] \
        if candidates \
        else None


if __name__ == '__main__':
    print(
        dumps([
            choice
            for name, lang in fetch_yaml(URL).items()
            for choice in tuple([pick_shortest(name.lower(), lang)])
            if choice is not None
        ]),
    )
