package command

type ShellcheckCommand struct {
	BaseCommand
}

// CLI executor for [ShellCheck](https://www.shellcheck.net/).
var Shellcheck = ShellcheckCommand{
	BaseCommand: BaseCommand{
		Binary:     "shellcheck",
		ConfigFile: nil,
	},
}
