package command

import (
	"fmt"
	"os"

	"github.com/Clever/csvlint"
)

type CsvlintCommand struct {
	BaseCommand
}

// CLI executor for [csvlint](https://github.com/Clever/csvlint/).
var Csvlint = CsvlintCommand{
	BaseCommand: BaseCommand{
		Binary:     "csvlint",
		ConfigFile: nil,
	},
}

func (c *CsvlintCommand) IsAvailable() bool {
	return true
}

func (c *CsvlintCommand) Execute(l Linter, _ bool, targetPaths []string) int {
	finalCode := 0
	for _, p := range targetPaths {
		file, err := os.Open(p)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error opening file %s: %v\n", p, err)
			finalCode = 1
			continue
		}
		defer file.Close()

		invalids, halted, err := csvlint.Validate(file, ',', false)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error validating %s: %v\n", p, err)
			finalCode = 1
			continue
		}

		if len(invalids) > 0 {
			fmt.Printf("%s\n", p)
			for _, invalid := range invalids {
				fmt.Printf("  %s\n", invalid.Error())
			}
			finalCode = 1
		}

		if halted {
			fmt.Printf("  (unable to parse any further)\n")
		}
	}
	return finalCode
}
