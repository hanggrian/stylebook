package command

type CheckmakeCommand struct {
	BaseCommand
}

// CLI executor for [checkmake](https://github.com/checkmake/checkmake/).
var Checkmake = CheckmakeCommand{
	BaseCommand: BaseCommand{
		Binary:     "checkmake",
		ConfigFile: new("checkmake.ini"),
	},
}

func (c *CheckmakeCommand) GetArguments(targetPaths []string, quiet bool) []string {
	args := []string{"--config", c.GetConfigFile()}
	args = append(args, targetPaths...)
	return args
}
