from stylebook.commands import Command


class YamllintCommand(Command):
    """CLI executor for <a href="https://github.com/adrienverge/yamllint/">yamllint</b>."""

    def __init__(self) -> None:
        super().__init__('yamllint', 'yamllintrc.yaml')

    def get_arguments(self, _) -> list[str]:
        return ['-c', self.config_file]
