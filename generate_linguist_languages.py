from collections.abc import Generator, ItemsView
from json import dumps
from typing import Any
from urllib.request import urlopen

from colorama import Fore, Style
from yaml import safe_load

URL: str = 'https://github.com/github-linguist/linguist/raw/main/lib/linguist/languages.yml'

# names with multiple candidates that cannot be automatically picked
SPECIAL_NAMES: dict[str, str] = {
    '1C Enterprice': 'bsl',
    'AGS Script': 'ash',
    'AMPL': 'mod',
    'ASP.NET': 'aspx',
    'ATS': 'dats',
    'Adblock Filter List': 'txt',
    'AngelScript': 'as',
    'Antlers': 'antlers.html',
    'AsciiDoc': 'adoc',
    'Assembly': 'asm',
    'Batchfile': 'bat',
    'Befunge': 'bf',
    'Brainfuck': 'bf',
    'C#': 'cs',
    'C++': 'cpp',
    'C2hs Haskell': 'chs',
    'CartoCSS': 'mss',
    'Clean': 'icl',
    'Clojure': 'clj',
    'Common Lisp': 'lisp',
    'CoffeeScript': 'coffee',
    'Cython': 'pyx',
    'Emacs Lisp': 'elisp',
    'F#': 'fs',
    'F*': 'fst',
    'Go Checksums': 'go.sum',
    'Go Module': 'go.mod',
    'Go Workspace': 'go.work',
    'HCL': 'tf',
    'Ignore List': 'gitignore',
    'Java Server Pages': 'jsp',
    'JavaScript': 'js',
    'JetBrains MPS': 'mps',
    'Makefile': 'make',
    'Markdown': 'md',
    'Mermaid': 'mmd',
    'MiniYAML': 'yaml',
    'OASv2-yaml': 'yaml',
    'OASv3-yaml': 'yaml',
    'Objective-C': 'obj-c',
    'Objective-C++': 'obj-c++',
    'Objective-J': 'obj-j',
    'PostScript': 'ps',
    'PowerBuilder': 'pbt',
    'Python': 'py',
    'Q#': 'qs',
    'RMarkdown': 'rmd',
    'SELinux Policy': 'selinux',
    'reStructuredText:': 'rst',
}


def debug(name: str, candidates: set[str], picked: str, color: str) -> None:
    converted_color: str = \
        Fore.CYAN \
            if name in SPECIAL_NAMES \
            else color
    line: str = f'{Style.BRIGHT}{name}{Style.RESET_ALL}: ['
    for i, candidate in enumerate(candidates):
        line += \
            f'{converted_color}{candidate}{Style.RESET_ALL}' \
                if candidate == picked \
                else f'{Style.DIM}{candidate}{Style.RESET_ALL}'
        if i < len(candidates) - 1:
            line += ', '
    line += ']'
    print(line)


def pick_candidate(name: str, lang: dict[str, str]) -> str | None:
    # collect candidates
    candidates: set[str] = \
        set(
            [alias.lower() for alias in lang.get('aliases', [])] + \
            [extension.lower().lstrip('.') for extension in lang.get('extensions', [])],
        )

    # single candidate is always chosen
    if len(candidates) == 1:
        return candidates.pop()

    # prioritize candidate with the same language name
    if name in SPECIAL_NAMES:
        special_candidate: str | None = SPECIAL_NAMES.get(name)
        if special_candidate is not None:
            debug(name, candidates, special_candidate, Fore.GREEN)
            return special_candidate
    for candidate in sorted(candidates, key=len, reverse=True):
        for i in range(len(name) - 1, -1, -1):
            if candidate == name.lower()[0:i]:
                debug(name, candidates, candidate, Fore.GREEN)
                return candidate

    # otherwise, pick shortest name
    if not candidates:
        print(f'{Style.BRIGHT}{name}{Style.RESET_ALL}: {Fore.RED}no candidate{Style.RESET_ALL}')
        return None
    shortest_candidate: str = sorted(candidates, key=len)[0]
    debug(name, candidates, shortest_candidate, Fore.YELLOW)
    return shortest_candidate


def iter_choices(items: ItemsView[str, Any]) -> Generator[str, Any, None]:
    seen: set[str] = set()
    for name, lang in items:
        choice: str | None = pick_candidate(name, lang)
        if choice is None or choice in seen:
            continue
        seen.add(choice)
        yield choice


if __name__ == '__main__':
    with urlopen(URL) as response:
        result: dict[str, Any] = safe_load(response.read())
    print(dumps(list(iter_choices(result.items()))))
