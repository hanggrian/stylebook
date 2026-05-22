package protolint

import (
	"bytes"
	"os"

	"github.com/yoheimuta/go-protoparser/v4/parser"
	"github.com/yoheimuta/go-protoparser/v4/parser/meta"
	"github.com/yoheimuta/protolint/linter/report"
	"github.com/yoheimuta/protolint/linter/rule"

	"github.com/hanggrian/stylebook/rules"
)

type TrailingNewlineRule struct {
}

func NewTrailingNewlineRule() TrailingNewlineRule {
	return TrailingNewlineRule{}
}

func (r TrailingNewlineRule) ID() string {
	return "TRAILING_NEWLINE"
}

func (r TrailingNewlineRule) Purpose() string {
	return "Verifies that there is a trailing newline at the end of the file."
}

func (r TrailingNewlineRule) IsOfficial() bool {
	return true
}

func (r TrailingNewlineRule) Severity() rule.Severity {
	return rule.SeverityWarning
}

func (r TrailingNewlineRule) Apply(proto *parser.Proto) ([]report.Failure, error) {
	// read file
	content, err := os.ReadFile(proto.Meta.Filename)
	if err != nil {
		return nil, err
	}
	if len(content) > 0 && bytes.HasSuffix(content, []byte("\n")) {
		return nil, nil
	}
	line := 1
	column := 1

	// checks for violation
	if len(content) > 0 {
		line = bytes.Count(content, []byte("\n")) + 1
		column =
			len(
				bytes.Split(content, []byte("\n"))[len(bytes.Split(content, []byte("\n")))-1],
			) + 1
	}
	return []report.Failure{
		report.Failuref(
			meta.Position{Filename: proto.Meta.Filename, Line: line, Column: column},
			r.ID(),
			string(r.Severity()),
			"%s",
			rules.GetMessage("trailing.newline"),
		),
	}, nil
}
