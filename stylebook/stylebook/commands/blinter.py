from importlib.util import find_spec

from stylebook.commands.command import Command


class BlinterCommand(Command):
    """CLI executor for <a href="https://github.com/tboy1337/Blinter/">Blinter</a>."""

    def __init__(self) -> None:
        super().__init__('blinter')

    def is_available(self) -> bool:
        return find_spec(self.binary) is not None

    def get_arguments(self, target_paths: list[str], quiet: bool) -> list[str]:
        return target_paths

    def execute(self, target_paths: list[str], quiet: bool) -> int:
        has_errors: bool = False
        for target_path in target_paths:
            if super().execute([target_path], quiet) != 0:
                has_errors = True
        return 1 if has_errors else 0
