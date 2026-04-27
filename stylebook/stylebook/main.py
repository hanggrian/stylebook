from os.path import splitext
from pathlib import Path
from sys import argv, exit as exit2, stderr

from stylebook.cli import cyan, blue, red, b, i

from stylebook.commands import Command, SqlfluffCommand, TaploCommand, YamllintCommand

ITALIC: str = '\033[3m'

APP_BINARY: str = 'stylebook'
APP_VERSION: str = '0.2'


def walk(target_path: Path) -> list[str]:
    """Recursively traverse directories to collect files."""
    if target_path.is_file():
        return [str(target_path)]
    if target_path.is_dir():
        results = []
        for child in target_path.iterdir():
            results.extend(walk(child))
        return results
    return []


def run() -> None:
    """Main entry point."""
    # parse input arguments
    input_args: list[str] = argv[1:]
    silent: bool = False
    if not input_args:
        print(red('Need a path.'), file=stderr)
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
    sqlfluff_command: Command = SqlfluffCommand()
    taplo_command: Command = TaploCommand()
    yamllint_command: Command = YamllintCommand()
    commands: dict[Command, list[str]] = {
        sqlfluff_command: [],
        taplo_command: [],
        yamllint_command: [],
    }
    for target_path in [
        path for arg in input_args \
        if arg not in ('-s', '--silent') \
        for path in walk(Path(arg))
    ]:
        match Path(target_path).suffix.lower():
            case '.sql':
                commands[sqlfluff_command].append(target_path)
                
            case '.toml':
                commands[taplo_command].append(target_path)

            case '.yaml' | '.yml':
                commands[yamllint_command].append(target_path)
    if not silent:
        for command, paths in commands.items():
            title: str = b(command.binary)
            print(
                *(
                    [
                        f'\u2705 {title}',
                        *[
                            f'  - {root}{i(ext)}'
                            for path in paths
                            # pylint: disable=consider-using-tuple
                            for root, ext in [splitext(path)]
                        ],
                    ] if command.is_available() else [f'\u2718 {title}']
                ),
                sep='\n',
            )
        print()

    # collect exit codes, any non-zero code will be treated as failure
    exit2(
        min(
            1,
            sum(command.execute(silent, paths) for command, paths in commands.items() if paths),
        ),
    )
