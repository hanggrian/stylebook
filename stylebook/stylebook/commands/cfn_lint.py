from importlib.util import find_spec

from cfnlint.config import ConfigMixIn
from cfnlint.match import Match
from cfnlint.runner import Runner

from stylebook.commands.command import Command


class CfnLintCommand(Command):
    """
    API executor for
    <a href="https://github.com/aws-cloudformation/cfn-lint/">CloudFormation Linter</a>.
    """

    def __init__(self):
        super().__init__('cfnlint', 'cfnlintrc.yaml')

    def is_available(self) -> bool:
        return find_spec(self.binary) is not None

    def execute(self, target_paths: list[str], quiet: bool) -> int:
        has_errors: bool = False
        for path in target_paths:
            matches: list[Match] = \
                list(
                    Runner(
                        ConfigMixIn(
                            [
                                '--template',
                                path,
                                '--config-file',
                                self.config_file,
                            ],
                        ),
                    ).run(),
                )
            if not matches:
                continue
            has_errors = True
            for m in matches:
                print(
                    f'{self.embed_path(
                        path,
                        m.linenumber,
                        m.columnnumber,
                    )} {m.message} ({m.rule.id})',
                )
        return 1 if has_errors else 0
