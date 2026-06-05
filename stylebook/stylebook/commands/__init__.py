from enum import Enum

from stylebook.commands.ansible_lint import AnsibleLintCommand
from stylebook.commands.asciidoc_linter import AsciidocLinterCommand
from stylebook.commands.blinter import BlinterCommand
from stylebook.commands.command import Command
from stylebook.commands.dotenv_linter import DotenvLinterCommand
from stylebook.commands.pyinilint import PyinilintLinterCommand
from stylebook.commands.restructuredtext_lint import RestructuredtextLintCommand
from stylebook.commands.sqlfluff import SqlfluffCommand
from stylebook.commands.taplo import TaploCommand
from stylebook.commands.yamllint import YamllintCommand


class Linter(Enum):
    ANSIBLE_LINT = AnsibleLintCommand()
    ASCIIDOC_LINTER = AsciidocLinterCommand()
    BLINTER = BlinterCommand()
    DOTENV_LINTER = DotenvLinterCommand()
    PYINILINT = PyinilintLinterCommand()
    RESTRUCTUREDTEXT_LINT = RestructuredtextLintCommand()
    SQLFLUFF = SqlfluffCommand()
    TAPLO = TaploCommand()
    YAMLLINT = YamllintCommand()


NAMES: set[str] = {linter.value.binary for linter in Linter}

__all__: list[str] = [
    'Command',
    'Linter',
    'NAMES',
]
