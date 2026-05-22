package protolint

import (
	"os"

	"bytes"

	"github.com/yoheimuta/go-protoparser/v4/parser"
	"github.com/yoheimuta/go-protoparser/v4/parser/meta"
	"github.com/yoheimuta/protolint/linter/report"
	"github.com/yoheimuta/protolint/linter/rule"

	"github.com/hanggrian/stylebook/rules"
)

type UnnecessaryLeadingBlankLineRule struct {
}

func NewUnnecessaryLeadingBlankLineRule() UnnecessaryLeadingBlankLineRule {
	return UnnecessaryLeadingBlankLineRule{}
}

// Backwards-compatible constructor expected by tests and callers.
func NewNoLeadingNewlineRule() UnnecessaryLeadingBlankLineRule {
	return NewUnnecessaryLeadingBlankLineRule()
}

func (r UnnecessaryLeadingBlankLineRule) ID() string {
	return "NO_LEADING_NEWLINE"
}

func (r UnnecessaryLeadingBlankLineRule) Purpose() string {
	return "Verifies that there is no leading newline at the beginning of the file."
}

func (r UnnecessaryLeadingBlankLineRule) IsOfficial() bool {
	return true
}

func (r UnnecessaryLeadingBlankLineRule) Severity() rule.Severity {
	return rule.SeverityWarning
}

func (r UnnecessaryLeadingBlankLineRule) Apply(proto *parser.Proto) ([]report.Failure, error) {
	// read file
	content, err := os.ReadFile(proto.Meta.Filename)
	if err != nil {
		return nil, err
	}
	if len(content) == 0 {
		return nil, nil
	}

	// checks for violation
	if !bytes.HasPrefix(content, []byte("\n")) && !bytes.HasPrefix(content, []byte("\r\n")) {
		return nil, nil
	}
	return []report.Failure{
		report.Failuref(
			meta.Position{Filename: proto.Meta.Filename, Line: 1, Column: 1},
			r.ID(),
			string(r.Severity()),
			"%s",
			rules.GetMessage("unnecessary.leading.blank.line"),
		),
	}, nil
}
