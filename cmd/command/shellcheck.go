package command

type ShellCheckCommand struct {
	BaseCommand
}

// CLI executor for [ShellCheck](https://www.shellcheck.net/).
var ShellCheck = ShellCheckCommand{
	BaseCommand: BaseCommand{
		Binary:     "shellcheck",
		ConfigFile: nil,
	},
}
