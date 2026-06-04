package command

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

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

func (c *CsvlintCommand) Execute(l Linter, targetPaths []string, quiet bool) int {
	finalCode := 0
	for _, path := range targetPaths {
		delimiter := ','
		if strings.ToLower(filepath.Ext(path)) == ".tsv" {
			delimiter = '\t'
		}

		file, err := os.Open(path)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error opening file %s: %v\n", path, err)
			finalCode = 1
			continue
		}
		defer file.Close()

		invalids, halted, err := csvlint.Validate(file, delimiter, false)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error validating %s: %v\n", path, err)
			finalCode = 1
			continue
		}

		if len(invalids) > 0 {
			fmt.Printf("%s\n", path)
			for _, invalid := range invalids {
				fmt.Fprintf(os.Stderr, "  %s\n", invalid.Error())
			}
			finalCode = 1
		}

		if halted {
			fmt.Fprintf(os.Stderr, "  (unable to parse any further)\n")
		}
	}
	return finalCode
}
