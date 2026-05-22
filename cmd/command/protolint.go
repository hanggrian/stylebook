package command

import (
	"bytes"
	"fmt"
	"os"

	"github.com/yoheimuta/protolint/lib"
)

type ProtolintCommand struct {
	BaseCommand
}

// CLI executor for [protolint](https://github.com/yoheimuta/protolint/).
var Protolint = ProtolintCommand{
	BaseCommand: BaseCommand{
		Binary:     "protolint",
		ConfigFile: ptr("protolint.yaml"),
	},
}

func (c *ProtolintCommand) IsAvailable() bool {
	return true
}

func (c *ProtolintCommand) Execute(l Linter, _ bool, targetPaths []string) int {
	var stdout bytes.Buffer
	var stderr bytes.Buffer

	args := []string{"-config_path", c.GetConfigFile()}
	args = append(args, targetPaths...)

	err := lib.Lint(args, &stdout, &stderr)
	if stdout.Len() > 0 {
		fmt.Print(stdout.String())
	}
	if stderr.Len() > 0 {
		fmt.Fprintf(os.Stderr, "Error executing protolint: %s\n", stderr.String())
		return 1
	}
	if err != nil {
		return 1
	}
	return 0
}
