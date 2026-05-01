import platform
from abc import ABC, abstractmethod
from subprocess import run

from stylebook.files import get_config_file


class Command(ABC):
    """Abstract class for linter command."""

    def __init__(self, binary: str, config_file: str | None = None) -> None:
        self.binary = binary
        if config_file is not None:
            self.config_file = get_config_file(config_file)

    def is_available(self) -> bool:
        """Returns true if package is installed."""
        return run(
            ['where' if platform == 'win32' else 'which', self.binary],
            capture_output=True,
        ).returncode == 0

    @abstractmethod
    def get_arguments(self, quiet: bool, target_paths: list[str]) -> list[str]:
        """Abstract method to define specific lint command for this linter."""
        pass

    def execute(self, quiet: bool, target_paths: list[str]) -> int:
        """Run lint command for the given collection of paths."""
        return run(
            [
                self.binary,
                *self.get_arguments(quiet, target_paths),
            ],
            capture_output=False,
        ).returncode
