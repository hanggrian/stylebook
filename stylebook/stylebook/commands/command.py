import platform
from abc import ABC, abstractmethod
from importlib.resources import files
from pathlib import Path
from subprocess import run


class Command(ABC):
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
        return run(
            ['where' if platform == 'win32' else 'which', self.binary],
            capture_output=True,
        ).returncode == 0

    @abstractmethod
    def get_arguments(self, silent: bool) -> list[str]:
        pass

    def execute(self, silent: bool, target_paths: list[str]) -> int:
        return run(
            [self.binary, *self.get_arguments(silent), *target_paths],
            capture_output=False,
        ).returncode
