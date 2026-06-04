import platform
from subprocess import run

from stylebook.colors import blue, u
from stylebook.files import get_config_file


class Command:
    """Abstract class for linter command."""

    def __init__(self, binary: str, config_file: str | None = None) -> None:
        self.binary = binary
        if config_file is not None:
            self.config_file = get_config_file(config_file)

    def is_available(self) -> bool:
        """Returns true if package is installed."""
        return run(
            ['where' if platform == 'win32' else 'which', self.binary],
            check=False,
            capture_output=True,
        ).returncode == 0

    def get_arguments(self, target_paths: list[str], quiet: bool) -> list[str]:
        """Abstract method to define specific lint command for this linter."""
        pass  # pylint: disable=unnecessary-pass

    def execute(self, target_paths: list[str], quiet: bool) -> int:
        """Run lint command for the given collection of paths."""
        return run(
            [
                self.binary,
                *self.get_arguments(target_paths, quiet),
            ],
            check=False,
            capture_output=False,
        ).returncode

    @staticmethod
    def embed_path(file_path: str, line: int | None, col: int | None) -> str:
        return f'\x1b]8;;file://{file_path}' + \
            (f'#L{line}:C{col}' if line and col else (f'#L{line}' if line else '')) + \
            f'\x1b\\{u(blue(f'{file_path}:{line}:{col}'))}\x1b]8;;\x1b\\'
