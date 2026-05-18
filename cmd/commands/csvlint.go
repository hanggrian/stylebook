package commands

type CsvlintCommand struct {
	BaseCommand
}

func NewCsvlintCommand() *CsvlintCommand {
	return &CsvlintCommand {
		BaseCommand: BaseCommand {
			Binary: "csvlint",
		},
	}
}

func (c *CsvlintCommand) GetArguments(quiet bool, targetPaths []string) []string {
	return targetPaths
}
