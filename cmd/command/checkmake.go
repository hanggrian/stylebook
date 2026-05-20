package command

type CheckmakeCommand struct {
	BaseCommand
}

// CLI executor for [checkmake](https://github.com/checkmake/checkmake/).
var Checkmake = CheckmakeCommand{
	BaseCommand: BaseCommand{
		Binary:     "checkmake",
		ConfigFile: ptr("checkmake.ini"),
	},
}

func (c *CheckmakeCommand) GetArguments(_ bool, targetPaths []string) []string {
	args := []string{"--config", c.GetConfigFile()}
	args = append(args, targetPaths...)
	return args
}
