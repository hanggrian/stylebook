package cmd

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"runtime/debug"
	"strings"

	"github.com/hanggrian/stylebook/cmd/command"
	"github.com/hanggrian/stylebook/cmd/files"
)

func walk(targetPath string, exclude []string) []string {
	cleaned := filepath.Clean(targetPath)
	parts := strings.Split(cleaned, string(os.PathSeparator))
	for _, part := range parts {
		for _, ex := range exclude {
			if part == ex {
				return nil
			}
		}
	}
	info, err := os.Stat(cleaned)
	if err != nil {
		return nil
	}
	if !info.IsDir() {
		return []string{cleaned}
	}
	var files []string
	entries, err := os.ReadDir(cleaned)
	if err != nil {
		return nil
	}
	for _, entry := range entries {
		files = append(files, walk(filepath.Join(cleaned, entry.Name()), exclude)...)
	}
	return files
}

func Execute() error {
	// parse input arguments
	inputArgs := os.Args[1:]
	if len(inputArgs) == 0 {
		fmt.Fprintln(os.Stderr, Red("Need a path."))
		os.Exit(1)
	}
	var exclude []string
	var quiet bool
	var remainingArgs []string
	for _, arg := range inputArgs {
		if strings.HasPrefix(arg, "-e=") {
			exclude = append(exclude, strings.Split(strings.TrimPrefix(arg, "-e="), ",")...)
		} else if strings.HasPrefix(arg, "--exclude=") {
			exclude =
				append(exclude, strings.Split(strings.TrimPrefix(arg, "--exclude="), ",")...)
		} else {
			remainingArgs = append(remainingArgs, arg)
		}
	}
	if len(exclude) == 0 {
		file, _ := os.Open(files.GetConfigFile("stylebookrc"))
		defer file.Close()
		scanner := bufio.NewScanner(file)
		for scanner.Scan() {
			line := strings.TrimSpace(scanner.Text())
			if line == "" || strings.HasPrefix(line, "#") {
				continue
			}
			if strings.HasSuffix(line, "/") {
				line = line[:len(line)-1]
			}
			exclude = append(exclude, line)
		}
	}
	for _, arg := range remainingArgs {
		if arg == "-h" ||
			arg == "--help" {
			fmt.Printf("Go runner for Stylebook linter aggregator\n\n")
			fmt.Printf("\U0001f680 %s\n", B("Usage:"))
			fmt.Printf("   stylebook %s %s\n\n", Cyan("<paths>"), Blue("[options]"))
			fmt.Printf("\U0001f4c4 %s\n", B(Cyan("Paths:")))
			fmt.Printf(
				"   file      Supports %s, %s, %s, %s, %s, %s,\n",
				I("CSV"),
				I("LaTeX"),
				I("Dockerfile"),
				I("go.mod"),
				I("Makefile"),
				I("Properties"),
			)
			fmt.Printf(
				"             %s, %s, %s, %s and their variants \n",
				I("Protobuf"),
				I("Shell"),
				I("Terraform"),
				I("XML"),
			)
			fmt.Printf("   dir       Recursively find files in this directory\n")
			fmt.Printf(
				"   pattern   For example, %s for all CSV files in this\n",
				I("*.csv"),
			)
			fmt.Printf("             directory, %s for all files\n\n", I("**/*"))
			fmt.Printf("\u2699\ufe0f  %s\n", B(Blue("Options:")))
			fmt.Printf("   -e  [ --exclude ] arg   List of files or directories to ignore\n")
			fmt.Printf("   -h  [ --help ]          Display this message\n")
			fmt.Printf("   -q  [ --quiet ]         Disable verbose output\n")
			fmt.Printf("   -v  [ --version ]       Show app version\n")
			return nil
		}
		if arg == "-v" ||
			arg == "--version" {
			version := "dev"
			if info, ok := debug.ReadBuildInfo(); ok {
				if info.Main.Version != "(devel)" {
					version = info.Main.Version
				}
			}
			fmt.Printf("stylebook %s\n", B(version))
			return nil
		}
		if arg == "-q" ||
			arg == "--quiet" {
			quiet = true
		}
	}

	// insert target paths to corresponding command
	commands := make(map[string][]string)
	commands[command.Checkmake.GetBinary()] = []string{}
	commands[command.Chktex.GetBinary()] = []string{}
	commands[command.Csvlint.GetBinary()] = []string{}
	commands[command.Gomoddirectives.GetBinary()] = []string{}
	commands[command.Hadolint.GetBinary()] = []string{}
	commands[command.Propertieslint.GetBinary()] = []string{}
	commands[command.Protolint.GetBinary()] = []string{}
	commands[command.ShellCheck.GetBinary()] = []string{}
	commands[command.Tflint.GetBinary()] = []string{}
	commands[command.Xmllint.GetBinary()] = []string{}
	order :=
		[]string{
			command.Checkmake.GetBinary(),
			command.Chktex.GetBinary(),
			command.Csvlint.GetBinary(),
			command.Gomoddirectives.GetBinary(),
			command.Hadolint.GetBinary(),
			command.Propertieslint.GetBinary(),
			command.Protolint.GetBinary(),
			command.ShellCheck.GetBinary(),
			command.Tflint.GetBinary(),
			command.Xmllint.GetBinary(),
		}
	seen := make(map[string]bool)
	for _, arg := range remainingArgs {
		if arg == "-q" ||
			arg == "--quiet" {
			continue
		}
		for _, path := range walk(arg, exclude) {
			if seen[path] {
				continue
			}
			seen[path] = true
			filename := filepath.Base(path)
			if filename == "Makefile" ||
				filename == "makefile" ||
				filename == "GNUmakefile" {
				commands[command.Checkmake.GetBinary()] =
					append(commands[command.Checkmake.GetBinary()], path)
				continue
			}
			if filename == "Containerfile" ||
				filename == "Dockerfile" ||
				strings.HasPrefix(filename, "Containerfile.") ||
				strings.HasPrefix(filename, "Dockerfile.") {
				commands[command.Hadolint.GetBinary()] =
					append(commands[command.Hadolint.GetBinary()], path)
				continue
			}
			if filename == "go.mod" {
				commands[command.Gomoddirectives.GetBinary()] =
					append(commands[command.Gomoddirectives.GetBinary()], path)
				continue
			}
			switch strings.ToLower(filepath.Ext(path)) {
			case ".csv", ".tsv":
				commands[command.Csvlint.GetBinary()] =
					append(commands[command.Csvlint.GetBinary()], path)

			case ".tex", ".ltx", ".latex":
				commands[command.Chktex.GetBinary()] =
					append(commands[command.Chktex.GetBinary()], path)

			case ".properties":
				commands[command.Propertieslint.GetBinary()] =
					append(commands[command.Propertieslint.GetBinary()], path)

			case ".proto":
				commands[command.Protolint.GetBinary()] =
					append(commands[command.Protolint.GetBinary()], path)

			case ".bash", ".sh", ".zsh":
				commands[command.ShellCheck.GetBinary()] =
					append(commands[command.ShellCheck.GetBinary()], path)

			case ".xml", ".xhtml", ".xsl", ".xslt", ".svg", ".xaml", ".plist":
				commands[command.Xmllint.GetBinary()] =
					append(commands[command.Xmllint.GetBinary()], path)

			case ".tf":
				commands[command.Tflint.GetBinary()] =
					append(commands[command.Tflint.GetBinary()], path)
			}
		}
	}
	if !quiet {
		for _, binaryName := range order {
			title := B(binaryName)
			paths := commands[binaryName]
			var cmd command.Linter
			switch binaryName {
			case command.Checkmake.GetBinary():
				cmd = &command.Checkmake
			case command.Chktex.GetBinary():
				cmd = &command.Chktex
			case command.Csvlint.GetBinary():
				cmd = &command.Csvlint
			case command.Gomoddirectives.GetBinary():
				cmd = &command.Gomoddirectives
			case command.Hadolint.GetBinary():
				cmd = &command.Hadolint
			case command.Propertieslint.GetBinary():
				cmd = &command.Propertieslint
			case command.Protolint.GetBinary():
				cmd = &command.Protolint
			case command.ShellCheck.GetBinary():
				cmd = &command.ShellCheck
			case command.Xmllint.GetBinary():
				cmd = &command.Xmllint
			case command.Tflint.GetBinary():
				cmd = &command.Tflint
			}
			if !cmd.IsAvailable() {
				fmt.Printf("\U0001f6ab %s: Unavailable\n", title)
				continue
			}
			if len(paths) == 0 {
				fmt.Printf("\U0001fad9 %s: Empty\n", title)
				continue
			}
			fmt.Printf("\u2705\ufe0f %s:\n", title)
			for _, path := range paths {
				ext := filepath.Ext(path)
				root := path[:len(path)-len(ext)]
				slash := strings.LastIndex(root, "/") + 1
				fmt.Printf("   %s%s%s\n", D(root[:slash]), root[slash:], I(ext))
			}
		}
		fmt.Println()
	}

	// report result
	empty := true
	var violatingLinters []string
	for _, binaryName := range order {
		paths := commands[binaryName]
		var cmd command.Linter
		switch binaryName {
		case command.Checkmake.GetBinary():
			cmd = &command.Checkmake
		case command.Chktex.GetBinary():
			cmd = &command.Chktex
		case command.Csvlint.GetBinary():
			cmd = &command.Csvlint
		case command.Gomoddirectives.GetBinary():
			cmd = &command.Gomoddirectives
		case command.Hadolint.GetBinary():
			cmd = &command.Hadolint
		case command.Propertieslint.GetBinary():
			cmd = &command.Propertieslint
		case command.Protolint.GetBinary():
			cmd = &command.Protolint
		case command.ShellCheck.GetBinary():
			cmd = &command.ShellCheck
		case command.Xmllint.GetBinary():
			cmd = &command.Xmllint
		case command.Tflint.GetBinary():
			cmd = &command.Tflint
		default:
			continue
		}
		if !cmd.IsAvailable() || len(paths) == 0 {
			continue
		}
		empty = false
		if cmd.Execute(cmd, quiet, paths) != 0 {
			violatingLinters = append(violatingLinters, binaryName)
		}
	}
	if len(violatingLinters) > 0 {
		fmt.Fprintf(
			os.Stderr,
			"\u274c\ufe0f %s\n",
			Red(
				fmt.Sprintf(
					"Linter(s) reported violations: %s.",
					B(strings.Join(violatingLinters, ", ")),
				),
			),
		)
		os.Exit(1)
	}
	if empty {
		fmt.Printf("\U0001f47b %s\n", Yellow("No files to lint."))
		os.Exit(1)
	}
	if !quiet {
		fmt.Printf("\U0001f389 %s\n", Green("All linters passed, no violation found."))
	}
	os.Exit(0)
	return nil
}
