package command

type ChktexCommand struct {
	BaseCommand
}

// CLI executor for [ChkTeX](https://www.nongnu.org/chktex/).
var Chktex = ChktexCommand{
	BaseCommand: BaseCommand{
		Binary:     "chktex",
		ConfigFile: ptr("chktexrc"),
	},
}

func (c *ChktexCommand) GetArguments(targetPaths []string, quiet bool) []string {
	args := []string{"-wall", "-l", c.GetConfigFile()}
	if quiet {
		args = append(args, "-q")
	}
	args = append(args, targetPaths...)
	return args
}
