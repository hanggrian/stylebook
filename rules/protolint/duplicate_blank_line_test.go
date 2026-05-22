package protolint

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/yoheimuta/go-protoparser/v4/lexer"
	"github.com/yoheimuta/go-protoparser/v4/parser"
)

func TestDuplicateBlankLineRule_Apply(t *testing.T) {
	testDir := t.TempDir()
	filePath := filepath.Join(testDir, "duplicate_blank_line.proto")
	content := "syntax = \"proto3\";\n\n\nmessage Foo {}\n"
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

	failures, applyErr := NewDuplicateBlankLineRule().Apply(proto)
	if applyErr != nil {
		t.Fatalf("apply rule: %v", applyErr)
	}
	if len(failures) != 1 {
		t.Fatalf("got %d failures, want 1", len(failures))
	}
	if got := failures[0].RuleID(); got != "DUPLICATE_BLANK_LINE" {
		t.Fatalf("got rule id %q, want %q", got, "DUPLICATE_BLANK_LINE")
	}
}

func TestDuplicateBlankLineRule_Apply_NoFailure(t *testing.T) {
	testDir := t.TempDir()
	filePath := filepath.Join(testDir, "duplicate_blank_line_ok.proto")
	content := "syntax = \"proto3\";\n\nmessage Foo {}\n"
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

	failures, applyErr := NewDuplicateBlankLineRule().Apply(proto)
	if applyErr != nil {
		t.Fatalf("apply rule: %v", applyErr)
	}
	if len(failures) != 0 {
		t.Fatalf("got %d failures, want 0", len(failures))
	}
}
