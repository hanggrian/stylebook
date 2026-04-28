from stylebook.commands.command import Command
from stylebook.commands.sqlfluff import SqlfluffCommand
from stylebook.commands.taplo import TaploCommand
from stylebook.commands.yamllint import YamllintCommand

SQLFLUFF: Command = SqlfluffCommand()
TAPLO: Command = TaploCommand()
YAMLLINT: Command = YamllintCommand()

__all__: list[str] = [
    'Command',
    'SQLFLUFF',
    'TAPLO',
    'YAMLLINT',
]
