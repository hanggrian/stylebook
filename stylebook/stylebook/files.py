from importlib.resources import files
from pathlib import Path


def get_config_file(config_file: str) -> str:
    """
    Returns local configuration file if it exists. Otherwise, use the default file in the resources
    directory.
    """
    local_config_file: Path = Path.cwd() / f'.{config_file}'
    return str(
        local_config_file
        if local_config_file.is_file()
        else files('stylebook.resources').joinpath(config_file),
    )
