from pathlib import Path
from sys import argv, exit, stderr

from stylebook_data.commands import Command, SqlfluffCommand, TaploCommand, YamllintCommand


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
    if not input_args:
        print('Need a path.', file=stderr)
        exit(1)

    sqlfluff_command: Command = SqlfluffCommand()
    taplo_command: Command = TaploCommand()
    yamllint_command: Command = YamllintCommand()
    commands: dict[Command, list[str]] = {
        sqlfluff_command: [],
        taplo_command: [],
        yamllint_command: [],
    }
    for target_path in [path for arg in input_args for path in walk(Path(arg))]:
        match Path(target_path).suffix.lower():
            case '.sql':
                commands[sqlfluff_command].append(target_path)
            case '.toml':
                commands[taplo_command].append(target_path)
            case '.yaml' | '.yml':
                commands[yamllint_command].append(target_path)

    exit(
        min(
            1,
            sum(command.execute(paths) for command, paths in commands.items() if paths),
        ),
    )
