from stylebook.commands.command import Command


class TaploCommand(Command):
    """CLI executor for <a href="https://taplo.tamasfe.dev/">Taplo</a>."""

    def __init__(self):
        super().__init__('taplo', 'taplo.toml')

    def get_arguments(self, target_paths: list[str], quiet: bool) -> list[str]:
        args: list[str] = ['lint', '-c', self.config_file, *target_paths]
        return args \
            if quiet \
            else [*args, '--verbose']
