package command

import (
	"fmt"
	"os"

	"golang.org/x/mod/modfile"

	"github.com/ldez/gomoddirectives"
)

type GomoddirectivesCommand struct {
	BaseCommand
}

// CLI executor for [gomoddirectives](https://github.com/ldez/gomoddirectives/).
var Gomoddirectives = GomoddirectivesCommand{
	BaseCommand: BaseCommand{
		Binary:     "gomoddirectives",
		ConfigFile: nil,
	},
}

func (c *GomoddirectivesCommand) IsAvailable() bool {
	return true
}

func (c *GomoddirectivesCommand) Execute(_ Linter, _ bool, targetPaths []string) int {
	finalCode := 0
	options :=
		gomoddirectives.Options{
			ReplaceAllowLocal:         true,
			ExcludeForbidden:          true,
			IgnoreForbidden:           true,
			RetractAllowNoExplanation: true,
			ToolchainForbidden:        true,
			ToolForbidden:             true,
			GoDebugForbidden:          true,
			CheckModulePath:           true,
		}
	for _, path := range targetPaths {
		data, err := os.ReadFile(path)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error running gomoddirectives on %s: %v\n", path, err)
			finalCode = 1
			continue
		}
		file, err := modfile.Parse(path, data, nil)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error running gomoddirectives on %s: %v\n", path, err)
			finalCode = 1
			continue
		}
		results := gomoddirectives.AnalyzeFile(file, options)
		if len(results) > 0 {
			finalCode = 1
		}
		for _, result := range results {
			fmt.Fprintf(
				os.Stderr,
				"%s: %s\n",
				embedPath(path, result.Start.Line, result.Start.Column),
				result.Reason,
			)
		}
	}
	return finalCode
}
