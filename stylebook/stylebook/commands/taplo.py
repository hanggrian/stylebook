from stylebook.commands import Command


class TaploCommand(Command):
    def __init__(self):
        super().__init__('taplo', 'taplo.toml')

    def get_arguments(self) -> list[str]:
        return ['fmt', '--diff', '-c', self.config_file]
