from importlib.util import find_spec

from stylebook.commands.command import Command


class PyinilintLinterCommand(Command):
    """CLI executor for <a href="https://gitlab.com/danieljrmay/pyinilint/">pyinilint</a>."""

    def __init__(self) -> None:
        super().__init__('pyinilint')

    def is_available(self) -> bool:
        return find_spec(self.binary) is not None

    def get_arguments(self, target_paths: list[str], quiet: bool) -> list[str]:
        return target_paths \
            if quiet \
            else [*target_paths, '--verbose']
