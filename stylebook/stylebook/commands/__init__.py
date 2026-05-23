from stylebook.commands.command import Command
from stylebook.commands.blinter import BlinterCommand
from stylebook.commands.dotenv_linter import DotenvLinterCommand
from stylebook.commands.pyinilint import PyinilintLinterCommand
from stylebook.commands.restructuredtext_lint import RestructuredtextLintCommand
from stylebook.commands.sqlfluff import SqlfluffCommand
from stylebook.commands.taplo import TaploCommand
from stylebook.commands.yamllint import YamllintCommand

BLINTER: Command = BlinterCommand()
DOTENV_LINTER: Command = DotenvLinterCommand()
PYINILINT: Command = PyinilintLinterCommand()
RESTRUCTUREDTEXT_LINT: Command = RestructuredtextLintCommand()
SQLFLUFF: Command = SqlfluffCommand()
TAPLO: Command = TaploCommand()
YAMLLINT: Command = YamllintCommand()

__all__: list[str] = [
    'Command',
    'BLINTER',
    'DOTENV_LINTER',
    'PYINILINT',
    'RESTRUCTUREDTEXT_LINT',
    'SQLFLUFF',
    'TAPLO',
    'YAMLLINT',
]
