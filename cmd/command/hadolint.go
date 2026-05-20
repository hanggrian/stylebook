package command

type HadolintCommand struct {
	BaseCommand
}

// CLI executor for [Hadolint](https://github.com/hadolint/hadolint/).
var Hadolint = HadolintCommand{
	BaseCommand: BaseCommand{
		Binary:     "hadolint",
		ConfigFile: ptr("hadolint.yaml"),
	},
}

func (c *HadolintCommand) GetArguments(quiet bool, targetPaths []string) []string {
	args := []string{"-c", c.GetConfigFile()}
	if quiet {
		args = append(args, "-V")
	}
	args = append(args, targetPaths...)
	return args
}
