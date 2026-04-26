from stylebook_data.commands import Command


class SqlfluffCommand(Command):
    def __init__(self):
        super().__init__('sqlfluff', 'sqlfluff')

    def get_arguments(self) -> list[str]:
        return ['lint', '--config', self.config_file]
