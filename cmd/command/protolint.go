package command

import (
	"bytes"
	"fmt"
	"os"

	"github.com/hanggrian/stylebook/rules/protolint"
	"github.com/yoheimuta/go-protoparser/v4/lexer"
	"github.com/yoheimuta/go-protoparser/v4/parser"
	"github.com/yoheimuta/protolint/lib"
	"github.com/yoheimuta/protolint/linter/report"
)

type ProtolintCommand struct {
	BaseCommand
}

type protoRule interface {
	Apply(*parser.Proto) ([]report.Failure, error)
}

// CLI executor for [protolint](https://github.com/yoheimuta/protolint/).
var Protolint = ProtolintCommand{
	BaseCommand: BaseCommand{
		Binary:     "protolint",
		ConfigFile: new("protolint.yaml"),
	},
}

func (c *ProtolintCommand) IsAvailable() bool {
	return true
}

func (c *ProtolintCommand) Execute(l Linter, targetPaths []string, quiet bool) int {
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	args := []string{"-config_path", c.GetConfigFile()}
	args = append(args, targetPaths...)
	err := lib.Lint(args, &stdout, &stderr)
	if stdout.Len() > 0 {
		fmt.Fprintf(os.Stdout, "%s\n", stdout.String())
	}
	if err != nil {
		fmt.Fprintf(os.Stderr, "%s\n", stderr.String())
		return 1
	}

	hasFailure := false
	for _, path := range targetPaths {
		if c.runProtoRules(
			path,
			protolint.NewDuplicateBlankLineRule(),
			protolint.NewTrailingNewlineRule(),
			protolint.NewUnnecessaryLeadingBlankLineRule(),
		) {
			hasFailure = true
		}
	}
	if stderr.Len() > 0 ||
		hasFailure {
		return 1
	}
	return 0
}

func (c *ProtolintCommand) runProtoRules(targetPath string, rules ...protoRule) bool {
	file, err := os.Open(targetPath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "%s\n", err)
		return true
	}
	defer file.Close()

	proto, parseErr := parser.NewParser(
		lexer.NewLexer(file, lexer.WithFilename(targetPath)),
	).ParseProto()
	if parseErr != nil {
		fmt.Fprintf(os.Stderr, "%s\n", parseErr)
		return true
	}

	hasFailure := false
	for _, rule := range rules {
		failures, applyErr := rule.Apply(proto)
		if applyErr != nil {
			fmt.Fprintf(os.Stderr, "%s\n", applyErr)
			hasFailure = true
			continue
		}
		for _, failure := range failures {
			fmt.Fprintf(os.Stderr, "%s\n", failure.String())
			hasFailure = true
		}
	}
	return hasFailure
}
