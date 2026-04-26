from stylebook_data.commands import Command


class TaploCommand(Command):
    def __init__(self):
        super().__init__('taplo', 'taplo.toml')

    def get_arguments(self) -> list[str]:
        return ['fmt', '--check', '-c', self.config_file]
