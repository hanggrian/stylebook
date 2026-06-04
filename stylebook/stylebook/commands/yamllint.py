from importlib.util import find_spec
from typing import Any

from yamllint import linter
from yamllint.config import YamlLintConfig

from stylebook.commands.command import Command


class YamllintCommand(Command):
    """CLI executor for <a href="https://github.com/adrienverge/yamllint/">yamllint</a>."""

    def __init__(self) -> None:
        super().__init__('yamllint', 'yamllintrc.yaml')

    def is_available(self) -> bool:
        return find_spec(self.binary) is not None

    def execute(self, target_paths: list[str], quiet: bool) -> int:
        config: YamlLintConfig = YamlLintConfig(file=self.config_file)
        has_errors: bool = False
        for path in target_paths:
            with open(path, encoding='UTF-8') as f:
                problems: list[Any] = list(linter.run(f, config))
            if not problems:
                continue
            has_errors = True
            for problem in problems:
                print(
                    f'{self.embed_path(path, problem.line, problem.column)} '
                    f'{problem.message}',
                )
        return 1 if has_errors else 0
