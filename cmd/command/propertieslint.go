package command

import (
	"fmt"
	"os"

	"github.com/hanggrian/propertieslint/linter"
)

type PropertieslintCommand struct {
	BaseCommand
}

// CLI executor for [propertieslint](https://hanggrian.github.io/propertieslint/).
var Propertieslint = PropertieslintCommand{
	BaseCommand: BaseCommand{
		Binary:     "propertieslint",
		ConfigFile: ptr("propertieslint.json"),
	},
}

func (c *PropertieslintCommand) IsAvailable() bool {
	return true
}

func (c *PropertieslintCommand) Execute(_ Linter, _ bool, targetPaths []string) int {
	config, err := linter.LoadConfig(linter.ResolveConfigPath(c.GetConfigFile()))
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		return 1
	}

	result, err := linter.Targets(targetPaths, config)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		return 2
	}

	for _, issue := range result.Issues {
		fmt.Fprintf(
			os.Stderr,
			"%s: %s\n",
			embedPath(issue.Path, issue.Line, issue.Column),
			issue.Message,
		)
	}
	if len(result.Issues) > 0 {
		return 1
	}
	return 0
}
