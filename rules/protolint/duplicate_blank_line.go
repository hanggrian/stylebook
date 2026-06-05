package protolint

import (
	"bufio"
	"os"
	"strings"

	"github.com/yoheimuta/go-protoparser/v4/parser"
	"github.com/yoheimuta/go-protoparser/v4/parser/meta"

	"github.com/yoheimuta/protolint/linter/disablerule"
	"github.com/yoheimuta/protolint/linter/report"
	"github.com/yoheimuta/protolint/linter/rule"

	"github.com/hanggrian/stylebook/rules/resources"
)

type DuplicateBlankLineRule struct {
}

func NewDuplicateBlankLineRule() DuplicateBlankLineRule {
	return DuplicateBlankLineRule{}
}

func (r DuplicateBlankLineRule) ID() string {
	return "DUPLICATE_BLANK_LINE"
}

func (r DuplicateBlankLineRule) Purpose() string {
	return "Verifies that there are no more than one consecutive blank line."
}

func (r DuplicateBlankLineRule) IsOfficial() bool {
	return true
}

func (r DuplicateBlankLineRule) Severity() rule.Severity {
	return rule.SeverityWarning
}

func (r DuplicateBlankLineRule) Apply(proto *parser.Proto) ([]report.Failure, error) {
	// read file
	reader, err := os.Open(proto.Meta.Filename)
	if err != nil {
		return nil, err
	}
	defer reader.Close()
	var lines []string
	scanner := bufio.NewScanner(reader)
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}
	if err := scanner.Err(); err != nil {
		return nil, err
	}

	// checks for violation
	var failures []report.Failure
	consecutiveBlankLines := 0
	disablerule.NewInterpreter(r.ID()).CallEachIfValid(lines, func(index int, line string) {
		if strings.TrimSpace(line) == "" {
			consecutiveBlankLines++
			if 1 < consecutiveBlankLines {
				failures =
					append(
						failures,
						report.Failuref(
							meta.Position{
								Filename: proto.Meta.Filename,
								Line:     index + 1,
								Column:   1,
							},
							r.ID(),
							string(r.Severity()),
							"%s",
							resources.GetMessage("duplicate.blank.line"),
						),
					)
			}
			return
		}
		consecutiveBlankLines = 0
	})
	return failures, nil
}
