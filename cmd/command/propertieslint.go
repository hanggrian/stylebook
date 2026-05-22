package command

import (
	"fmt"

	"github.com/hanggrian/propertieslint/propertieslint"
)

type PropertieslintCommand struct {
	BaseCommand
}

// CLI executor for [propertieslint](https://hanggrian.github.io/propertieslint/).
var Propertieslint = PropertieslintCommand{
	BaseCommand: BaseCommand{
		Binary:     "propertieslint",
		ConfigFile: nil,
	},
}

func (c *PropertieslintCommand) IsAvailable() bool {
	return true
}

func (c *PropertieslintCommand) Execute(l Linter, _ bool, targetPaths []string) int {
	config, err := propertieslint.LoadConfig(propertieslint.ResolveConfigPath(c.GetConfigFile()))
	if err != nil {
		fmt.Println(err)
		return 1
	}

	result, err := propertieslint.Targets(targetPaths, config)
	if err != nil {
		fmt.Println(err)
		return 2
	}

	for _, issue := range result.Issues {
		fmt.Printf("%s: %s\n", embedPath(issue.Path, issue.Line, issue.Column), issue.Message)
	}
	if len(result.Issues) > 0 {
		return 1
	}
	if result.CheckedFiles == 0 {
		fmt.Println("no properties files found")
		return 1
	}
	fmt.Printf("lint ok: %d file(s) checked\n", result.CheckedFiles)
	return 0
}
