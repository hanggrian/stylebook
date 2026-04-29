from stylebook.commands import Command


class TaploCommand(Command):
    """CLI executor for <a href="https://taplo.tamasfe.dev/">Taplo</b>."""

    def __init__(self):
        super().__init__('taplo', 'taplo.toml')

    def get_arguments(self, quiet: bool, target_paths: list[str]) -> list[str]:
        args: list[str] = ['fmt', '--diff', '-c', self.config_file, *target_paths]
        return args \
            if quiet \
            else [*args, '--verbose']
