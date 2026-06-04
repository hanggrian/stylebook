from importlib.metadata import version
from os.path import splitext
from pathlib import Path
from sys import argv, exit as exit2

from stylebook.colors import cyan, blue, b, d, green, i, magenta, red, yellow
from stylebook.commands import Linter, NAMES
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


def register(commands: dict[Linter, list[str]], linter: Linter, path: str):
    """Insert path to map if the linter key exists."""
    paths: list[str] | None = commands.get(linter)
    if paths is not None:
        paths.append(path)


def run() -> None:
    """Main entry point."""
    # parse input arguments
    input_args: list[str] = argv[1:]
    disable: set[str] = set()
    unsupported_disable: set[str] = set()
    exclude: set[str] = set()
    quiet: bool = False
    if not input_args:
        print(red('Need a path.'))
        exit2(1)
    for arg in input_args.copy():
        if not arg.startswith('-d=') and \
            not arg.startswith('--disable=') and \
            not arg.startswith('-e=') and \
            not arg.startswith('--exclude='):
            continue
        input_args.remove(arg)
        for a in arg.split('=')[1].split(','):
            if arg.startswith('-d=') or \
                arg.startswith('--disable='):
                (disable if a in NAMES else unsupported_disable).add(a)
                continue
            exclude.add(a)
    if unsupported_disable:
        print(red(f'Unsupported linters: {b(', '.join(unsupported_disable))}'))
        exit2(1)
    if not exclude:
        with open(get_config_file('stylebookrc'), 'r', encoding='UTF-8') as file:
            for line in [line.strip() for line in file]:
                if not line or line.startswith('#'):
                    continue
                exclude.add(line.rstrip('/') if line.endswith('/') else line)
    if '-h' in input_args or \
        '--help' in input_args:
        print('Python runner for Stylebook linter aggregator\n')
        print(f'\U0001f680 {b(cyan('Usage:'))}')
        print(f'   {cyan('stylebook')} {magenta('[PATHS]')} {blue('[OPTIONS]')}\n')
        print(f'\U0001f4c4 {b(magenta('Paths:'))}')
        print(f'   {magenta('file')}      Supports file types and their variants:')
        print(
            '             ' +
            '\u2022 AsciiDoc           ' +
            '\u2022 Batch   ' +
            '\u2022 Dotenv   ' +
            '\u2022 INI',
        )
        print(
            '             ' +
            '\u2022 reStructuredText   ' +
            '\u2022 SQL     ' +
            '\u2022 TOML     ' +
            '\u2022 YAML',
        )
        print(f'   {magenta('dir')}       Recursively find files in this directory')
        print(f'   {magenta('pattern')}   For example, {i('*.bat')} for all Batch files in this')
        print(f'             directory, {i('**/*')} for all files\n')
        print(f'\u2699\ufe0f  {b(blue('Options:'))}')
        print(
            f'   {blue('-d')}, {blue('--disable')} {d(blue('[LINTERS]'))}     ' +
            'List of linters to deactivate:',
        )
        print(
            '                               ' +
            f'\u2022 {Linter.ASCIIDOC_LINTER.value.binary}         ' +
            f'\u2022 {Linter.BLINTER.value.binary}',
        )
        print(
            '                               ' +
            f'\u2022 {Linter.DOTENV_LINTER.value.binary}           ' +
            f'\u2022 {Linter.PYINILINT.value.binary}',
        )
        print(
            '                               ' +
            f'\u2022 {Linter.RESTRUCTUREDTEXT_LINT.value.binary}   ' +
            f'\u2022 {Linter.SQLFLUFF.value.binary}',
        )
        print(
            '                               ' +
            f'\u2022 {Linter.TAPLO.value.binary}                   ' +
            f'\u2022 {Linter.YAMLLINT.value.binary}',
        )
        print(
            f'   {blue('-e')}, {blue('--exclude')} {d(blue('[ARGUMENTS]'))}   ' +
            'List of files or directories to ignore',
        )
        print(
            f'   {blue('-h')}, {blue('--help')}                  ' +
            'Display this message',
        )
        print(
            f'   {blue('-q')}, {blue('--quiet')}                 ' +
            'Disable verbose output',
        )
        print(
            f'   {blue('-v')}, {blue('--version')}               ' +
            'Show app version',
        )
        exit2(0)
    if '-q' in input_args or \
        '--quiet' in input_args:
        quiet = True
    if '-v' in input_args or \
        '--version' in input_args:
        print(f'stylebook {b(version('stylebook'))}')
        exit2(0)

    # insert target paths to corresponding command
    commands: dict[Linter, list[str]] = {
        linter: [] for linter in Linter
        if linter.value.binary not in disable
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
            register(commands, Linter.DOTENV_LINTER, target_path)
            continue
        match filename.suffix.lower():
            case '.adoc' | '.asciidoc':
                register(commands, Linter.ASCIIDOC_LINTER, target_path)

            case '.bat' | '.btm' | '.cmd':
                register(commands, Linter.BLINTER, target_path)

            case '.ini' | '.cnf' | '.conf' | '.cfg' | '.url':
                register(commands, Linter.PYINILINT, target_path)

            case '.rst' | '.rest':
                register(commands, Linter.RESTRUCTUREDTEXT_LINT, target_path)

            case '.sql':
                register(commands, Linter.SQLFLUFF, target_path)

            case '.toml':
                register(commands, Linter.TAPLO, target_path)

            case '.yaml' | '.yml':
                register(commands, Linter.YAMLLINT, target_path)
    if not quiet:
        for command, paths in commands.items():
            if not paths:
                continue
            title: str = b(command.value.binary)
            if not command.value.is_available():
                print(f'\U0001f6ab {title}: Unavailable')
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
        if not command.value.is_available() or not paths:
            continue
        empty = False
        if command.value.execute(paths, quiet) != 0:
            violating_linters.append(command.value.binary)
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
