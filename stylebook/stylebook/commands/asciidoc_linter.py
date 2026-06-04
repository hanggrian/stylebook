from stylebook.commands.command import Command


class AsciidocLinterCommand(Command):
    """CLI executor for <a href="https://doctoolchain.org/asciidoc-linter/">AsciiDoc-Linter</a>."""

    def __init__(self) -> None:
        super().__init__('asciidoc-linter')

    def get_arguments(self, target_paths: list[str], quiet: bool) -> list[str]:
        return target_paths
