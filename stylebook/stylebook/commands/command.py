import platform
from abc import ABC, abstractmethod
from importlib.resources import files
from pathlib import Path
from subprocess import run


class Command(ABC):
    """Abstract class for linter command."""

    def __init__(self, binary: str, config_file: str) -> None:
        self.binary = binary
        local_config_file: Path = Path.cwd() / f'.{config_file}'
        self.config_file = \
            str(
                local_config_file
                if local_config_file.exists()
                else files('stylebook.resources').joinpath(config_file),
            )

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
