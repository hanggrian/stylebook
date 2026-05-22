package protolint

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/yoheimuta/go-protoparser/v4/lexer"
	"github.com/yoheimuta/go-protoparser/v4/parser"
)

func TestNoLeadingNewlineRule_Apply(t *testing.T) {
	testDir := t.TempDir()
	filePath := filepath.Join(testDir, "no_leading_newline.proto")
	content := "\nsyntax = \"proto3\";\nmessage Foo {}\n"
	if err := os.WriteFile(filePath, []byte(content), 0o600); err != nil {
		t.Fatalf("write proto file: %v", err)
	}

	file, err := os.Open(filePath)
	if err != nil {
		t.Fatalf("open proto file: %v", err)
	}
	proto, parseErr :=
		parser.NewParser(
			lexer.NewLexer(file, lexer.WithFilename(filePath)),
		).ParseProto()
	if closeErr := file.Close(); closeErr != nil {
		t.Fatalf("close proto file: %v", closeErr)
	}
	if parseErr != nil {
		t.Fatalf("parse proto: %v", parseErr)
	}

	failures, applyErr := NewNoLeadingNewlineRule().Apply(proto)
	if applyErr != nil {
		t.Fatalf("apply rule: %v", applyErr)
	}
	if len(failures) != 1 {
		t.Fatalf("got %d failures, want 1", len(failures))
	}
	if got := failures[0].RuleID(); got != "NO_LEADING_NEWLINE" {
		t.Fatalf("got rule id %q, want %q", got, "NO_LEADING_NEWLINE")
	}
}

func TestNoLeadingNewlineRule_Apply_NoFailure(t *testing.T) {
	testDir := t.TempDir()
	filePath := filepath.Join(testDir, "no_leading_newline_ok.proto")
	content := "syntax = \"proto3\";\nmessage Foo {}\n"
	if err := os.WriteFile(filePath, []byte(content), 0o600); err != nil {
		t.Fatalf("write proto file: %v", err)
	}

	file, err := os.Open(filePath)
	if err != nil {
		t.Fatalf("open proto file: %v", err)
	}
	proto, parseErr :=
		parser.NewParser(
			lexer.NewLexer(file, lexer.WithFilename(filePath)),
		).ParseProto()
	if closeErr := file.Close(); closeErr != nil {
		t.Fatalf("close proto file: %v", closeErr)
	}
	if parseErr != nil {
		t.Fatalf("parse proto: %v", parseErr)
	}

	failures, applyErr := NewNoLeadingNewlineRule().Apply(proto)
	if applyErr != nil {
		t.Fatalf("apply rule: %v", applyErr)
	}
	if len(failures) != 0 {
		t.Fatalf("got %d failures, want 0", len(failures))
	}
}
