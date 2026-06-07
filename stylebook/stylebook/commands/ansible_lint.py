from ansiblelint.app import get_app
from ansiblelint.config import Options
from ansiblelint.constants import DEFAULT_RULESDIR
from ansiblelint.rules import RulesCollection
from ansiblelint.runner import get_matches

from stylebook.commands.command import Command


class AnsibleLintCommand(Command):
    """API executor for <a href="https://docs.ansible.com/projects/lint/">Ansible Lint</a>."""

    def __init__(self):
        super().__init__('ansible-lint')

    def execute(self, target_paths: list[str], quiet: bool) -> int:
        options: Options = \
            Options(
                lintables=target_paths,
                quiet=quiet,
                skip_list=['yaml[indentation]'],  # handled by yamllint
            )
        has_errors: bool = False
        for match in get_matches(
            RulesCollection(
                app=get_app(offline=None, cached=True),
                options=options,
                rulesdirs=[DEFAULT_RULESDIR],
            ),
            options,
        ).matches:
            has_errors = True
            print(
                f'{self.embed_path(match.filename, match.lineno or 1, match.column or 1)} ' +
                match.message,
            )
        return 1 if has_errors else 0
