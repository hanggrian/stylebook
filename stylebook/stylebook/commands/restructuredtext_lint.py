from importlib.util import find_spec

from restructuredtext_lint import lint_file

from stylebook.commands.command import Command


class RestructuredtextLintCommand(Command):
    """
    API executor for
    <a href="https://github.com/twolfson/restructuredtext-lint/">restructuredtext-lint</a>.
    """

    def __init__(self):
        super().__init__('restructuredtext-lint')

    def is_available(self) -> bool:
        return find_spec('restructuredtext_lint') is not None

    def execute(self, target_paths: list[str], quiet: bool) -> int:
        has_errors: bool = False
        for target_path in target_paths:
            errors: list = lint_file(target_path)
            if not errors:
                continue
            has_errors = True
            for error in errors:
                print(f'{self.embed_path(target_path, error.line, 1)} {error.message}')
        return 1 if has_errors else 0
