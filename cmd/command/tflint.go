package command

import "path/filepath"

type TflintCommand struct {
	BaseCommand
}

// CLI executor for [tflint](https://github.com/terraform-linters/tflint/).
var Tflint = TflintCommand{
	BaseCommand: BaseCommand{
		Binary:     "tflint",
		ConfigFile: ptr("tflint.hcl"),
	},
}

func (c *TflintCommand) GetArguments(_ bool, targetPaths []string) []string {
	args := []string{"--config", c.GetConfigFile()}
	if len(targetPaths) > 0 {
		args = append(args, "--chdir", filepath.Dir(targetPaths[0]))
		for _, path := range targetPaths {
			args = append(args, "--filter", filepath.Base(path))
		}
	}
	return args
}
