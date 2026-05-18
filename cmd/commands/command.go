package commands

import (
	"os"
	"os/exec"
	"runtime"
)

type Linter interface {
	GetBinary() string
	GetArguments(quiet bool, targetPaths []string) []string
}

type BaseCommand struct {
	Binary string
	ConfigFile string
}

func (c *BaseCommand) GetBinary() string {
	return c.Binary
}

func (c *BaseCommand) IsAvailable() bool {
	cmdName := "which"
	if runtime.GOOS == "windows" {
		cmdName = "where"
	}
	return exec.Command(cmdName, c.Binary).Run() == nil
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
