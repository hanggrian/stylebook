from os.path import splitext
from pathlib import Path
from sys import argv, exit as exit2

from stylebook.cli import cyan, blue, b, d, red, i
from stylebook.commands import Command, SQLFLUFF, TAPLO, YAMLLINT

ITALIC: str = '\033[3m'

APP_BINARY: str = 'stylebook'
APP_VERSION: str = '0.2'
IGNORED_DIRS: frozenset[str] = \
    frozenset([
        'node_modules',
        'package-lock.json',
        'pnpm-lock.yaml',
        'venv',
        '.venv',
        'uv.lock',
    ])


def walk(target_path: Path) -> list[str]:
    """Recursively traverse directories to collect files."""
    if any(part in IGNORED_DIRS for part in target_path.parts):
        return []
    if target_path.is_file():
        return [str(target_path)]
    if target_path.is_dir():
        return [
            path
            for child in target_path.iterdir()
            for path in walk(child)
        ]
    return []


def run() -> None:
    """Main entry point."""
    # parse input arguments
    input_args: list[str] = argv[1:]
    silent: bool = False
    if not input_args:
        print(red('Need a path.'))
        exit2(1)
    if '-h' in input_args or \
        '--help' in input_args:
        print(
            'Helper for Stylebook linter extensions',
            '',
            b('Usage:'),
            f'  {cyan('stylebook <paths>')} {blue('[options]')}',
            '',
            b(cyan('Paths:')),
            f'  file       Supports '
            f'{i('.css')}, '
            f'{i('.html')}, '
            f'{i('.htm')}, '
            f'{i('.mhtml')}, '
            f'{i('.mthm')}, '
            f'{i('.json')},',
            '             '
            f'{i('.jsonc')}, '
            f'{i('.cjson')}, '
            f'{i('.json5')}, '
            f'{i('.md')}',
            '  dir        Recursively find files in this directory',
            f'  pattern    For example, {i('*.json')} for all JSON files in this',
            f'             directory, {i('**/*')} for all files',
            '',
            b(blue('Options:')),
            '  -h  [ --help ]                    Display this message',
            '  -s  [ --silent, -q, --quiet ]     Disable verbose output',
            '  -v  [ --version ]                 Show app version',
            sep='\n',
        )
        exit2(0)
    if '-v' in input_args or \
        '--version' in input_args:
        print(f'{APP_BINARY} {b(APP_VERSION)}')
        exit2(0)
    if '-s' in input_args or \
        '--silent' in input_args or \
        '-q' in input_args or \
        '--quiet' in input_args:
        silent = True

    # insert target paths to corresponding command
    commands: dict[Command, list[str]] = {
        SQLFLUFF: [],
        TAPLO: [],
        YAMLLINT: [],
    }
    for target_path in [
        path for arg in input_args \
        if arg not in ('-s', '--silent', '-q', '--quiet') \
        for path in walk(Path(arg))
    ]:
        match Path(target_path).suffix.lower():
            case '.sql':
                commands[SQLFLUFF].append(target_path)

            case '.toml':
                commands[TAPLO].append(target_path)

            case '.yaml' | '.yml':
                commands[YAMLLINT].append(target_path)
    if not silent:
        for command, paths in commands.items():
            title: str = b(command.binary)
            if not command.is_available():
                print(f'\u274c {title}: Unavailable')
                continue
            if not paths:
                print(f'\u26a0\ufe0f  {title}: Empty')
                continue
            print(
                *[
                    f'\u2705 {title}:',
                    *[
                        '   ' +
                        d(root[:root.rfind('/') + 1]) +
                        root[root.rfind('/') + 1:] +
                        i(ext)
                        for path in paths
                        # pylint: disable=consider-using-tuple
                        for root, ext in [splitext(path)]
                    ],
                ],
                sep='\n',
            )
        print()

    # collect exit codes, any non-zero code will be treated as failure
    exit2(
        min(
            1,
            sum(
                command.execute(silent, paths)
                for command, paths in commands.items()
                if command.is_available() and paths
            ),
        ),
    )
