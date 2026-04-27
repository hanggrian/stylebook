from os.path import splitext
from pathlib import Path
from sys import argv, exit as exit2, stderr

from colorama import Fore, Style

from stylebook.commands import Command, SqlfluffCommand, TaploCommand, YamllintCommand

ITALIC: str = '\033[3m'

APP_BINARY: str = 'stylebook'
APP_VERSION: str = '0.2'


def walk(target_path: Path) -> list[str]:
    if target_path.is_file():
        return [str(target_path)]
    if target_path.is_dir():
        results = []
        for child in target_path.iterdir():
            results.extend(walk(child))
        return results
    return []


def run() -> None:
    input_args: list[str] = argv[1:]
    silent: bool = False
    if not input_args:
        print(f'{Fore.RED}Need a path.{Style.RESET_ALL}', file=stderr)
        exit2(1)
    if '-h' in input_args or '--help' in input_args:
        print(
            'Helper for Stylebook linter extensions',
            '',
            f'{Style.BRIGHT}Usage:{Style.RESET_ALL}'
            f'  {Fore.CYAN}stylebook <paths>{Style.RESET_ALL} '
            f'{Fore.BLUE}[options]{Style.RESET_ALL}',
            '',
            f'{Style.BRIGHT}{Fore.CYAN}Paths:{Style.RESET_ALL}',
            f'  file       Supports '
            f'{ITALIC}.css{Style.RESET_ALL}, '
            f'{ITALIC}.html{Style.RESET_ALL}, '
            f'{ITALIC}.htm{Style.RESET_ALL}, '
            f'{ITALIC}.mhtml{Style.RESET_ALL}, '
            f'{ITALIC}.mthm{Style.RESET_ALL}, '
            f'{ITALIC}.json{Style.RESET_ALL},',
            '             '
            f'{ITALIC}.jsonc{Style.RESET_ALL}, '
            f'{ITALIC}.cjson{Style.RESET_ALL}, '
            f'{ITALIC}.json5{Style.RESET_ALL}, '
            f'{ITALIC}.md{Style.RESET_ALL}',
            '  dir        Recursively find files in this directory',
            f'  pattern    For example, {ITALIC}*.json{Style.RESET_ALL} for all JSON files in '
            'this',
            f'             directory, {ITALIC}**/*{Style.RESET_ALL} for all files',
            '',
            f'{Style.BRIGHT}{Fore.BLUE}Options:{Style.RESET_ALL}',
            '  -h  [ --help ]       Display this message',
            '  -s  [ --silent ]     Disable verbose output',
            '  -v  [ --version ]    Show app version',
            sep='\n',
        )
        exit2(0)
    if '-v' in input_args or '--version' in input_args:
        print(f'{APP_BINARY} {Style.BRIGHT}{APP_VERSION}{Style.RESET_ALL}')
        exit2(0)
    if '-s' in input_args or '--silent' in input_args:
        silent = True

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
            title: str = f'{Style.BRIGHT}{command.binary}{Style.RESET_ALL}'
            print(
                *(
                    [
                        f'\u2705 {title}',
                        *[
                            f'  - {root}{Style.DIM}{ext}{Style.RESET_ALL}'
                            for path in paths
                            # pylint: disable=consider-using-tuple
                            for root, ext in [splitext(path)]
                        ],
                    ] if command.is_available() else [f'\u2718 {title}']
                ),
                sep='\n',
            )
        print()
    exit2(
        min(
            1,
            sum(command.execute(silent, paths) for command, paths in commands.items() if paths),
        ),
    )
