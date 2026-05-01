from stylebook.commands.command import Command
from stylebook.commands.dotenv_linter import DotenvLinterCommand
from stylebook.commands.sqlfluff import SqlfluffCommand
from stylebook.commands.taplo import TaploCommand
from stylebook.commands.yamllint import YamllintCommand

DOTENV_LINTER: Command = DotenvLinterCommand()
SQLFLUFF: Command = SqlfluffCommand()
TAPLO: Command = TaploCommand()
YAMLLINT: Command = YamllintCommand()

__all__: list[str] = [
    'Command',
    'DOTENV_LINTER',
    'SQLFLUFF',
    'TAPLO',
    'YAMLLINT',
]
