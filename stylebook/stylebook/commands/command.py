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

    @abstractmethod
    def get_arguments(self) -> list[str]:
        pass

    def execute(self, target_paths: list[str]) -> int:
        return run(
            [self.binary, *self.get_arguments(), *target_paths],
            capture_output=False,
        ).returncode
