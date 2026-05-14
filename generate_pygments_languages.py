from ast import literal_eval
from json import dumps
from typing import Any
from urllib.request import urlopen

URL: str = 'https://github.com/pygments/pygments/raw/refs/heads/master/pygments/lexers/_mapping.py'


def fetch_pygments_mapping(url: str) -> dict[str, Any]:
    with urlopen(url) as response:
        content = response.read().decode('UTF-8')
        return literal_eval(content[content.index('{'):content.rindex('}') + 1])


def pick_shortest(short_names: tuple[str, ...]) -> str | None:
    if not short_names:
        return None
    valid: list[str] = [s for s in short_names if all(c.isalnum() or c == '-' for c in s)]
    if not valid:
        print(f'Ignored: {', '.join(short_names)}')
        return None
    return sorted(valid, key=lambda s: (len(s), s))[0]


if __name__ == '__main__':
    print(
        f'Result: {dumps([
            choice
            for name, entry in fetch_pygments_mapping(URL).items()
            for choice in tuple([pick_shortest(entry[2])])
            if choice is not None
        ])}',
    )
