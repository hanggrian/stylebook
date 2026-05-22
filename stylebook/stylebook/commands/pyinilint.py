from stylebook.commands.command import Command


class PyinilintLinterCommand(Command):
    """CLI executor for <a href="https://gitlab.com/danieljrmay/pyinilint/">pyinilint</a>."""

    def __init__(self) -> None:
        super().__init__('pyinilint')

    def get_arguments(self, quiet: bool, target_paths: list[str]) -> list[str]:
        return target_paths \
            if quiet \
            else [*target_paths, '--verbose']
