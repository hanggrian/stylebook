from stylebook.commands.command import Command


class BlinterCommand(Command):
    """CLI executor for <a href="https://github.com/tboy1337/Blinter/">Blinter</a>."""

    def __init__(self) -> None:
        super().__init__('blinter')

    def get_arguments(self, _: bool, target_paths: list[str]) -> list[str]:
        return target_paths
