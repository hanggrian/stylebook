package command

import (
	"fmt"
	"os"
	"os/exec"
	"runtime"

	"github.com/hanggrian/stylebook/cmd/files"
)

type Linter interface {
	IsAvailable() bool
	Execute(l Linter, quiet bool, targetPaths []string) int
	GetConfigFile() string
	GetBinary() string
	GetArguments(quiet bool, targetPaths []string) []string
}

type BaseCommand struct {
	Binary     string
	ConfigFile *string
}

func (c *BaseCommand) IsAvailable() bool {
	cmdName := "which"
	if runtime.GOOS == "windows" {
		cmdName = "where"
	}
	return exec.Command(cmdName, c.Binary).Run() == nil
}

func (c *BaseCommand) GetConfigFile() string {
	if c.ConfigFile == nil {
		return ""
	}
	return files.GetConfigFile(*c.ConfigFile)
}

func (c *BaseCommand) GetBinary() string {
	return c.Binary
}

func (c *BaseCommand) GetArguments(quiet bool, targetPaths []string) []string {
	return targetPaths
}

func (c *BaseCommand) Execute(l Linter, quiet bool, targetPaths []string) int {
	cmd := exec.Command(l.GetBinary(), l.GetArguments(quiet, targetPaths)...)
	if !quiet {
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
	}
	if err := cmd.Run(); err != nil {
		if exitError, ok := err.(*exec.ExitError); ok {
			return exitError.ExitCode()
		}
		return 1
	}
	return 0
}

func ptr(s string) *string { return &s }

func embedPath(filePath string, line int, col int) string {
	suffix := ""
	if line > 0 {
		if col > 0 {
			suffix = fmt.Sprintf("#L%d:C%d", line, col)
		} else {
			suffix = fmt.Sprintf("#L%d", line)
		}
	}
	return fmt.Sprintf(
		"\x1b]8;;file://%s%s\x1b\\%s:%d:%d\x1b]8;;\x1b\\",
		filePath,
		suffix,
		filePath,
		line,
		col,
	)
}
