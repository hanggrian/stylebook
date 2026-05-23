from importlib.metadata import version
from os.path import splitext
from pathlib import Path
from sys import argv, exit as exit2

from stylebook.colors import cyan, blue, b, d, green, i, red, yellow
from stylebook.commands import (
    Command,
    BLINTER,
    DOTENV_LINTER,
    PYINILINT,
    RESTRUCTUREDTEXT_LINT,
    SQLFLUFF,
    TAPLO,
    YAMLLINT,
)
from stylebook.files import get_config_file


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
        print('Python runner for Stylebook linter aggregator\n')
        print(f'\U0001f680 {b('Usage:')}')
        print(f'   stylebook {cyan('<paths>')} {blue('[options]')}\n')
        print(f'\U0001f4c4 {b(cyan('Paths:'))}')
        print(
            f'   file      Supports '
            f'{i('Batch')}, '
            f'{i('Dotenv')}, '
            f'{i('INI')}, '
            f'{i('reStructuredText')}, '
            f'{i('SQL')}, '
            f'{i('TOML')}, '
            f'{i('YAML')} and ',
        )
        print('             their variants')
        print('   dir       Recursively find files in this directory')
        print(f'   pattern   For example, {i('*.bat')} for all Batch files in this')
        print(f'             directory, {i('**/*')} for all files\n')
        print(f'\u2699\ufe0f  {b(blue('Options:'))}')
        print('   -e  [ --exclude ] arg   List of files or directories to ignore')
        print('   -h  [ --help ]          Display this message')
        print('   -q  [ --quiet ]         Disable verbose output')
        print('   -v  [ --version ]       Show app version')
        exit2(0)
    if '-q' in input_args or \
        '--quiet' in input_args:
        quiet = True
    if '-v' in input_args or \
        '--version' in input_args:
        print(f'stylebook {b(version('stylebook'))}')
        exit2(0)

    # insert target paths to corresponding command
    commands: dict[Command, list[str]] = {
        BLINTER: [],
        DOTENV_LINTER: [],
        PYINILINT: [],
        RESTRUCTUREDTEXT_LINT: [],
        SQLFLUFF: [],
        TAPLO: [],
        YAMLLINT: [],
    }
    for target_path in list(
        dict.fromkeys(
            path for arg in input_args
            for path in walk(Path(arg), exclude)
            if arg not in ('-q', '--quiet')
        ),
    ):
        filename: Path = Path(target_path)
        if filename.name == '.env' or \
            filename.name.startswith('.env.'):
            commands[DOTENV_LINTER].append(target_path)
            continue
        match filename.suffix.lower():
            case '.bat' | '.cmd':
                commands[BLINTER].append(target_path)

            case '.ini' | '.cfg' | '.conf':
                commands[PYINILINT].append(target_path)

            case '.rst' | '.rest':
                commands[RESTRUCTUREDTEXT_LINT].append(target_path)

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
                print(f'\U0001fad9 {title}: Empty')
                continue
            print(f'\u2705\ufe0f {title}:')
            print(
                *[
                    '   ' +
                    d(root[:root.rfind('/') + 1]) +
                    root[root.rfind('/') + 1:] +
                    i(ext)
                    for path in paths
                    # pylint: disable=consider-using-tuple
                    for root, ext in [splitext(path)]
                ],
                sep='\n',
            )
        print()

    # report result
    empty: bool = True
    violating_linters: list[str] = []
    for command, paths in commands.items():
        if not command.is_available() or not paths:
            continue
        empty = False
        if command.execute(quiet, paths) != 0:
            violating_linters.append(command.binary)
    if violating_linters:
        print(
            '\u274c\ufe0f '
            f'{red(f'Linter(s) reported violations: {b(f'{', '.join(violating_linters)}.')}')}',
        )
        exit2(1)
    if empty:
        print(f'\U0001f47b {yellow('No files to lint.')}')
        exit2(1)
    if not quiet:
        print(f'\U0001f389 {green('All linters passed, no violation found.')}')
    exit2(0)
