from stylebook.commands.command import Command


class DotenvLinterCommand(Command):
    """CLI executor for <a href="https://dotenv-linter.rtfd.io/">dotenv-linter</a>."""

    def __init__(self) -> None:
        super().__init__('dotenv-linter')

    def get_arguments(self, target_paths: list[str], quiet: bool) -> list[str]:
        return ['lint', *target_paths]
