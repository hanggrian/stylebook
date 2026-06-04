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
