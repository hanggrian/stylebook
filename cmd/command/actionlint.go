package command

import (
	"fmt"
	"io"
	"os"

	"github.com/rhysd/actionlint"
)

type ActionlintCommand struct {
	BaseCommand
}

// CLI executor for [actionlint](https://rhysd.github.io/actionlint/).
var Actionlint = ActionlintCommand{
	BaseCommand: BaseCommand{
		Binary:     "actionlint",
		ConfigFile: nil,
	},
}

func (c *ActionlintCommand) IsAvailable() bool {
	return true
}

func (c *ActionlintCommand) Execute(l Linter, targetPaths []string, quiet bool) int {
	out := io.Writer(os.Stdout)
	logOut := io.Writer(os.Stderr)
	if quiet {
		out = io.Discard
		logOut = io.Discard
	}

	checker, err :=
		actionlint.NewLinter(
			out,
			&actionlint.LinterOptions{
				LogWriter:  logOut,
				Shellcheck: "shellcheck",
				Pyflakes:   "pyflakes",
			},
		)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return 1
	}

	errs, err := checker.LintFiles(targetPaths, nil)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return 1
	}
	if len(errs) > 0 {
		return 1
	}
	return 0
}
