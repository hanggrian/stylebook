package cmd

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"runtime/debug"
	"slices"
	"strings"

	"github.com/hanggrian/stylebook/cmd/command"
	"github.com/hanggrian/stylebook/cmd/files"
)

// Recursively traverse directories to collect files.
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

// Insert path to map if the linter key exists.
func register(commands map[string][]string, linter command.Linter, path string) {
	if _, found := commands[linter.GetBinary()]; found {
		commands[linter.GetBinary()] = append(commands[linter.GetBinary()], path)
	}
}

func Execute() error {
	// parse input arguments
	inputArgs := os.Args[1:]
	if len(inputArgs) == 0 {
		fmt.Fprintln(os.Stderr, Red("Need a path."))
		os.Exit(1)
	}
	var disable []string
	var disableUnsupported []string
	var exclude []string
	var quiet bool
	var remainingArgs []string
	for _, arg := range inputArgs {
		if strings.HasPrefix(arg, "-e=") {
			exclude = append(exclude, strings.Split(strings.TrimPrefix(arg, "-e="), ",")...)
			continue
		}
		if strings.HasPrefix(arg, "--exclude=") {
			exclude =
				append(exclude, strings.Split(strings.TrimPrefix(arg, "--exclude="), ",")...)
			continue
		}
		if strings.HasPrefix(arg, "-d=") ||
			strings.HasPrefix(arg, "--disable=") {
			var linterNames []string
			if strings.HasPrefix(arg, "-d=") {
				linterNames = strings.Split(strings.TrimPrefix(arg, "-d="), ",")
			} else {
				linterNames = strings.Split(strings.TrimPrefix(arg, "--disable="), ",")
			}
			for _, linterName := range linterNames {
				if _, found := command.Names[linterName]; !found {
					disableUnsupported = append(disableUnsupported, linterName)
					continue
				}
				disable = append(disable, linterName)
			}
			continue
		}
		remainingArgs = append(remainingArgs, arg)
	}
	if len(disableUnsupported) > 0 {
		fmt.Fprintln(
			os.Stderr,
			Red("Unsupported linters: " + B(strings.Join(disableUnsupported, ", "))),
		)
		os.Exit(1)
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
			fmt.Printf("\U0001f680 %s\n", B(Cyan("Usage:")))
			fmt.Printf("   %s %s %s\n\n", Cyan("stylebook"), Magenta("[PATHS]"), Blue("[OPTIONS]"))
			fmt.Printf("\U0001f4c4 %s\n", B(Magenta("Paths:")))
			fmt.Printf("   %s      Supports file types and their variants:\n", Magenta("path"))
			fmt.Printf(
				"             " +
				"\u2022 CSV         " +
				"\u2022 LaTeX        " +
				"\u2022 Dockerfile   " +
				"\u2022 go.mod\n",
			)
			fmt.Printf(
				"             " +
				"\u2022 Makefile    " +
				"\u2022 Properties   " +
				"\u2022 Protobuf     " +
				"\u2022 Shell\n",
			)
			fmt.Printf(
				"             " +
				"\u2022 Terraform   " +
				"\u2022 XML\n",
			)
			fmt.Printf("   %s       Recursively find files in this directory\n", Magenta("dir"))
			fmt.Printf(
				"   %s   For example, %s for all CSV files in this\n",
				Magenta("pattern"),
				I("*.csv"),
			)
			fmt.Printf("             directory, %s for all files\n\n", I("**/*"))
			fmt.Printf("\u2699\ufe0f  %s\n", B(Blue("Options:")))
			fmt.Printf(
				"   %s, %s %s     List of linters to deactivate:\n",
				Blue("-d"),
				Blue("--disable"),
				D(Blue("[LINTERS]")),
			)
			fmt.Printf(
				"                               \u2022 %s   \u2022 %s\n",
				command.Checkmake.GetBinary(),
				command.Chktex.GetBinary(),
			)
			fmt.Printf(
				"                               \u2022 %s     \u2022 %s\n",
				command.Csvlint.GetBinary(),
				command.Gomoddirectives.GetBinary(),
			)
			fmt.Printf(
				"                               \u2022 %s    \u2022 %s\n",
				command.Hadolint.GetBinary(),
				command.Propertieslint.GetBinary(),
			)
			fmt.Printf(
				"                               \u2022 %s   \u2022 %s\n",
				command.Protolint.GetBinary(),
				command.Shellcheck.GetBinary(),
			)
			fmt.Printf(
				"                               \u2022 %s      \u2022 %s \n",
				command.Tflint.GetBinary(),
				command.Xmllint.GetBinary(),
			)
			fmt.Printf(
				"   %s, %s %s   List of files or directories to ignore\n",
				Blue("-e"),
				Blue("--exclude"),
				D(Blue("[ARGUMENTS]")),
			)
			fmt.Printf(
				"   %s, %s                  Display this message\n",
				Blue("-h"),
				Blue("--help"),
			)
			fmt.Printf(
				"   %s, %s                 Disable verbose output\n",
				Blue("-q"),
				Blue("--quiet"),
			)
			fmt.Printf(
				"   %s, %s               Show app version\n",
				Blue("-v"),
				Blue("--version"),
			)
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
	linters := []command.Linter{
		&command.Checkmake,
		&command.Chktex,
		&command.Csvlint,
		&command.Gomoddirectives,
		&command.Hadolint,
		&command.Propertieslint,
		&command.Protolint,
		&command.Shellcheck,
		&command.Tflint,
		&command.Xmllint,
	}
	commands := make(map[string][]string)
	order := make([]string, 0, len(linters))
	for _, linter := range linters {
		if !slices.Contains(disable, linter.GetBinary()) {
			commands[linter.GetBinary()] = []string{}
			order = append(order, linter.GetBinary())
		}
	}
	seen := make(map[string]bool)
	for _, arg := range remainingArgs {
		if arg == "-q" ||
			arg == "--quiet" {
			continue
		}
		for _, targetPath := range walk(arg, exclude) {
			if seen[targetPath] {
				continue
			}
			seen[targetPath] = true
			filename := filepath.Base(targetPath)
			if filename == "Makefile" ||
				filename == "makefile" ||
				filename == "GNUmakefile" {
				register(commands, &command.Checkmake, targetPath)
				continue
			}
			if filename == "Containerfile" ||
				filename == "Dockerfile" ||
				strings.HasPrefix(filename, "Containerfile.") ||
				strings.HasPrefix(filename, "Dockerfile.") {
				register(commands, &command.Hadolint, targetPath)
				continue
			}
			if filename == "go.mod" {
				register(commands, &command.Gomoddirectives, targetPath)
				continue
			}
			switch strings.ToLower(filepath.Ext(targetPath)) {
			case ".csv", ".tsv":
				register(commands, &command.Csvlint, targetPath)

			case ".tex", ".ltx", ".latex":
				register(commands, &command.Chktex, targetPath)

			case ".properties":
				register(commands, &command.Propertieslint, targetPath)

			case ".proto":
				register(commands, &command.Protolint, targetPath)

			case ".bash", ".sh", ".zsh":
				register(commands, &command.Shellcheck, targetPath)

			case ".xml", ".xhtml", ".xsl", ".xslt", ".svg", ".xaml", ".plist":
				register(commands, &command.Xmllint, targetPath)

			case ".tf":
				register(commands, &command.Tflint, targetPath)
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
			case command.Shellcheck.GetBinary():
				cmd = &command.Shellcheck
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
		case command.Shellcheck.GetBinary():
			cmd = &command.Shellcheck
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
