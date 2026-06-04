package command

type XmllintCommand struct {
	BaseCommand
}

// CLI executor for [xmllint](https://gnome.pages.gitlab.gnome.org/libxml2/xmllint.html).
var Xmllint = XmllintCommand{
	BaseCommand: BaseCommand{
		Binary:     "xmllint",
		ConfigFile: nil,
	},
}

func (c *XmllintCommand) GetArguments(targetPaths []string, quiet bool) []string {
	args := []string{"-noout"}
	args = append(args, targetPaths...)
	return args
}
