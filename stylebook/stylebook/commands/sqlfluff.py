from stylebook.commands import Command


class SqlfluffCommand(Command):
    """CLI executor for <a href="https://www.sqlfluff.com/">SQLFluff</b>."""

    def __init__(self):
        super().__init__('sqlfluff', 'sqlfluff')

    def get_arguments(self, _, target_paths: list[str]) -> list[str]:
        return ['lint', '--config', self.config_file, *target_paths]
