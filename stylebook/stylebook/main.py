from os.path import splitext
from pathlib import Path
from sys import argv, exit as exit2

from stylebook.colors import cyan, blue, b, d, green, i, red
from stylebook.commands import Command, DOTENV_LINTER, SQLFLUFF, TAPLO, YAMLLINT
from stylebook.files import get_config_file

APP_BINARY: str = 'stylebook'
APP_VERSION: str = '0.2'


def walk(target_path: Path, exclude: set[str]) -> list[str]:
    """Recursively traverse directories to collect files."""
    if any(part in exclude for part in target_path.parts):
        return []
    if target_path.is_file():
        return [str(target_path)]
    if target_path.is_dir():
        return [
            path
            for child in target_path.iterdir()
            for path in walk(child, exclude)
        ]
    return []


def run() -> None:
    """Main entry point."""
    # parse input arguments
    input_args: list[str] = argv[1:]
    exclude: set[str] = set()
    quiet: bool = False
    if not input_args:
        print(red('Need a path.'))
        exit2(1)
    for arg in input_args.copy():
        if not arg.startswith('-e=') and not arg.startswith('--exclude='):
            continue
        input_args.remove(arg)
        exclude.update(arg.split('=')[1].split(','))
    if not exclude:
        with open(get_config_file('stylebookrc'), 'r', encoding='UTF-8') as file:
            for line in [line.strip() for line in file]:
                if not line or line.startswith('#'):
                    continue
                exclude.add(line.rstrip('/') if line.endswith('/') else line)
    if '-h' in input_args or \
        '--help' in input_args:
        print(
            'Helper for Stylebook linter extensions',
            '',
            f'\U0001f680 {b('Usage:')}',
            f'   stylebook {cyan('<paths>')} {blue('[options]')}',
            '',
            f'\U0001f4c4 {b(cyan("'Paths:'"))}',
            f'   file      Supports '
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
            '   dir       Recursively find files in this directory',
            f'   pattern   For example, {i('*.json')} for all JSON files in this',
            f'             directory, {i('**/*')} for all files',
            '',
            f'\u2699\ufe0f  {b(blue('Options:'))}',
            '   -h  [ --help ]      Display this message',
            '   -q  [ --quiet ]     Disable verbose output',
            '   -v  [ --version ]   Show app version',
            sep='\n',
        )
        exit2(0)
    if '-q' in input_args or \
        '--quiet' in input_args:
        quiet = True
    if '-v' in input_args or \
        '--version' in input_args:
        print(f'{APP_BINARY} {b(APP_VERSION)}')
        exit2(0)

    # insert target paths to corresponding command
    commands: dict[Command, list[str]] = {
        DOTENV_LINTER: [],
        SQLFLUFF: [],
        TAPLO: [],
        YAMLLINT: [],
    }
    for target_path in [
        path for arg in input_args \
        for path in walk(Path(arg), exclude) \
        if arg not in ('-q', '--quiet')
    ]:
        target_file: Path = Path(target_path)
        if target_file.name.startswith('.env'):
            commands[DOTENV_LINTER].append(target_path)
            continue
        match target_file.suffix.lower():
            case '.sql':
                commands[SQLFLUFF].append(target_path)

            case '.toml':
                commands[TAPLO].append(target_path)

            case '.yaml' | '.yml':
                commands[YAMLLINT].append(target_path)
    if not quiet:
        for command, paths in commands.items():
            title: str = b(command.binary)
            if not command.is_available():
                print(f'\U0001f6ab {title}: Unavailable')
                continue
            if not paths:
                print(f'\U0001f47b {title}: Empty')
                continue
            print(
                *[
                    f'\u2705\ufe0f {title}:',
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

    # report result
    violating_linters: list[str] = [
        command.binary
        for command, paths in commands.items()
        if command.is_available() and paths and command.execute(quiet, paths)
    ]
    if violating_linters:
        print(
            '\u274c\ufe0f '
            f'{red(f'Linter(s) reported violations: {b(f'{', '.join(violating_linters)}.')}')}',
        )
        exit2(1)
    print(f'\U0001f389 {green('All linters passed, no violation found.')}')
    exit2(0)
