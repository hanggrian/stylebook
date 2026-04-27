from stylebook.commands import Command


class YamllintCommand(Command):
    def __init__(self) -> None:
        super().__init__('yamllint', 'yamllintrc.yaml')

    def get_arguments(self, _) -> list[str]:
        return ['-c', self.config_file]
