from importlib.util import find_spec
from pathlib import Path
from types import SimpleNamespace
from typing import Any

import sqlfluff

from stylebook.commands.command import Command


class SqlfluffCommand(Command):
    """API executor for <a href="https://www.sqlfluff.com/">SQLFluff</a>."""

    def __init__(self):
        super().__init__('sqlfluff', 'sqlfluff')

    def is_available(self) -> bool:
        return find_spec('sqlfluff') is not None

    def execute(self, _, target_paths: list[str]) -> int:
        has_errors: bool = False
        for path in target_paths:
            violations: list[dict[str, Any]] = \
                sqlfluff.lint(
                    Path(path).read_text(encoding='UTF-8'),
                    config_path=self.config_file,
                )
            if not violations:
                continue
            has_errors = True
            for violation in (SimpleNamespace(**violation) for violation in violations):
                print(
                    f'{self.embed_path(
                        path,
                        violation.start_line_no,
                        violation.start_line_pos,
                    )}: {violation.description} ({violation.code})',
                )
        return 1 if has_errors else 0
