from stylebook.commands.command import Command


class DotenvLinterCommand(Command):
    """CLI executor for <a href="https://dotenv-linter.rtfd.io/">dotenv-linter</a>."""

    def __init__(self) -> None:
        super().__init__('dotenv-linter')

    def get_arguments(self, _, target_paths: list[str]) -> list[str]:
        return ['lint', *target_paths]
