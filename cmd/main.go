package cmd

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"runtime/debug"
	"slices"
	"strings"

	"github.com/hanggrian/stylebook/cmd/colors"
	"github.com/hanggrian/stylebook/cmd/command"
	"github.com/hanggrian/stylebook/cmd/files"
)

var githubActionsPaths = []string{".github"}
var kubernetesPaths = []string{"k8s", "kubernetes", "manifests", "deploy"}

// Recursively traverse directories to collect files.
func walk(targetPath string, exclude []string) []string {
	cleaned := filepath.Clean(targetPath)
	parts := strings.SplitSeq(cleaned, string(os.PathSeparator))
	for part := range parts {
		if slices.Contains(exclude, part) {
			return nil
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
	dirname := filepath.Base(cleaned)
	if slices.Contains(githubActionsPaths, dirname) ||
		slices.Contains(kubernetesPaths, dirname) {
		files = append(files, cleaned)
	}
	return files
}

// Insert file to map if the linter key exists.
func register(commands map[string][]string, linter command.Linter, path string) {
	if _, found := commands[linter.GetBinary()]; found {
		commands[linter.GetBinary()] = append(commands[linter.GetBinary()], path)
	}
}

// Insert all files in a directory to map if the linter key exists and extension matches.
func registerDir(commands map[string][]string, linter command.Linter, path string, exts []string) {
	entries, err := os.ReadDir(path)
	if err != nil {
		return
	}
	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}
		name := entry.Name()
		ext := filepath.Ext(name)
		if !slices.Contains(exts, ext) {
			continue
		}
		register(commands, linter, filepath.Join(path, name))
	}
}

func Execute() error {
	// parse input arguments
	inputArgs := os.Args[1:]
	if len(inputArgs) == 0 {
		fmt.Fprintln(os.Stderr, colors.Red("Need a path."))
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
			colors.Red("Unsupported linters: "+colors.B(strings.Join(disableUnsupported, ", "))),
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
			line = strings.TrimSuffix(line, "/")
			exclude = append(exclude, line)
		}

		if err := scanner.Err(); err != nil {
			fmt.Fprintln(os.Stderr, colors.Red("Failed reading stylebookrc: "+err.Error()))
			os.Exit(1)
		}
	}
	for _, arg := range remainingArgs {
		if arg == "-h" ||
			arg == "--help" {
			fmt.Printf("Go runner for Stylebook linter aggregator\n\n")
			fmt.Printf("\U0001f680 %s\n", colors.B(colors.Cyan("Usage:")))
			fmt.Printf(
				"   %s %s %s\n\n",
				colors.Cyan("stylebook"),
				colors.Magenta("[PATHS]"),
				colors.Blue("[OPTIONS]"),
			)
			fmt.Printf("\U0001f4c4 %s\n", colors.B(colors.Magenta("Paths:")))
			fmt.Printf(
				"   %s      Supports file types and their variants:\n",
				colors.Magenta("path"),
			)
			fmt.Printf(
				"             " +
					"\u2022 CSV          " +
					"\u2022 LaTeX        " +
					"\u2022 Dockerfile   " +
					"\u2022 GitHub Actions\n",
			)
			fmt.Printf(
				"             " +
					"\u2022 Kubernetes   " +
					"\u2022 Makefile     " +
					"\u2022 Properties   " +
					"\u2022 Protobuf\n",
			)
			fmt.Printf(
				"             " +
					"\u2022 Shell        " +
					"\u2022 Terraform    " +
					"\u2022 XML          " +
					"\u2022 go.mod\n",
			)
			fmt.Printf(
				"   %s       Recursively find files in this directory\n",
				colors.Magenta("dir"),
			)
			fmt.Printf(
				"   %s   For example, %s for all CSV files in this\n",
				colors.Magenta("pattern"),
				colors.I("*.csv"),
			)
			fmt.Printf("             directory, %s for all files\n\n", colors.I("**/*"))
			fmt.Printf("\u2699\ufe0f  %s\n", colors.B(colors.Blue("Options:")))
			empty := colors.D(colors.Blue("(=[])"))
			fmt.Printf(
				"   %s, %s %s     List of linters to deactivate:\n",
				colors.Blue("-d"),
				colors.Blue("--disable=[LINTERS]"),
				empty,
			)
			fmt.Printf(
				"                                     \u2022 %s        \u2022 %s\n",
				command.Actionlint.GetBinary(),
				command.Checkmake.GetBinary(),
			)
			fmt.Printf(
				"                                     \u2022 %s            \u2022 %s\n",
				command.Chktex.GetBinary(),
				command.Csvlint.GetBinary(),
			)
			fmt.Printf(
				"                                     \u2022 %s   \u2022 %s\n",
				command.Gomoddirectives.GetBinary(),
				command.Hadolint.GetBinary(),
			)
			fmt.Printf(
				"                                     \u2022 %s       \u2022 %s\n",
				command.KubeLinter.GetBinary(),
				command.Propertieslint.GetBinary(),
			)
			fmt.Printf(
				"                                     \u2022 %s         \u2022 %s\n",
				command.Protolint.GetBinary(),
				command.Shellcheck.GetBinary(),
			)
			fmt.Printf(
				"                                     \u2022 %s            \u2022 %s \n",
				command.Tflint.GetBinary(),
				command.Xmllint.GetBinary(),
			)
			fmt.Printf(
				"   %s, %s %s   List of files or directories to ignore\n",
				colors.Blue("-e"),
				colors.Blue("--exclude=[ARGUMENTS]"),
				empty,
			)
			fmt.Printf(
				"   %s, %s                        Display this message\n",
				colors.Blue("-h"),
				colors.Blue("--help"),
			)
			fmt.Printf(
				"   %s, %s                       Disable verbose output\n",
				colors.Blue("-q"),
				colors.Blue("--quiet"),
			)
			fmt.Printf(
				"   %s, %s                     Show app version\n",
				colors.Blue("-v"),
				colors.Blue("--version"),
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
			fmt.Printf("stylebook %s\n", colors.B(version))
			return nil
		}
		if arg == "-q" ||
			arg == "--quiet" {
			quiet = true
		}
	}

	// insert target paths to corresponding command
	linters := []command.Linter{
		&command.Actionlint,
		&command.Checkmake,
		&command.Chktex,
		&command.Csvlint,
		&command.Gomoddirectives,
		&command.Hadolint,
		&command.KubeLinter,
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
			info, err := os.Stat(targetPath)
			if err != nil {
				continue
			}
			if info.IsDir() {
				if slices.Contains(githubActionsPaths, filename) {
					workflowsDir := filepath.Join(targetPath, "workflows")
					if _, err := os.Stat(workflowsDir); err != nil {
						continue
					}
					registerDir(
						commands,
						&command.Actionlint,
						workflowsDir,
						[]string{".yml", ".yaml"},
					)
				}
				if slices.Contains(kubernetesPaths, filename) {
					registerDir(
						commands,
						&command.KubeLinter,
						targetPath,
						[]string{".yml", ".yaml"},
					)
				}
				continue
			}
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

			case ".tex":
				register(commands, &command.Chktex, targetPath)

			case ".properties":
				register(commands, &command.Propertieslint, targetPath)

			case ".proto":
				register(commands, &command.Protolint, targetPath)

			case ".sh", ".bash":
				register(commands, &command.Shellcheck, targetPath)

			case ".xml", ".xhtml", ".xsl", ".svg", ".xaml":
				register(commands, &command.Xmllint, targetPath)

			case ".tf":
				register(commands, &command.Tflint, targetPath)
			}
		}
	}
	if !quiet {
		for _, binaryName := range order {
			paths := commands[binaryName]
			if len(paths) == 0 {
				continue
			}
			title := colors.B(binaryName)
			var cmd command.Linter
			switch binaryName {
			case command.Actionlint.GetBinary():
				cmd = &command.Actionlint
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
			case command.KubeLinter.GetBinary():
				cmd = &command.KubeLinter
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
			fmt.Printf("\u2705\ufe0f %s:\n", title)
			for _, path := range paths {
				ext := filepath.Ext(path)
				root := path[:len(path)-len(ext)]
				slash := strings.LastIndex(root, "/") + 1
				fmt.Printf("   %s%s%s\n", colors.D(root[:slash]), root[slash:], colors.I(ext))
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
		case command.Actionlint.GetBinary():
			cmd = &command.Actionlint
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
		case command.KubeLinter.GetBinary():
			cmd = &command.KubeLinter
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
		if !cmd.IsAvailable() ||
			len(paths) == 0 {
			continue
		}
		empty = false
		if cmd.Execute(cmd, paths, quiet) != 0 {
			violatingLinters = append(violatingLinters, binaryName)
		}
	}
	if len(violatingLinters) > 0 {
		fmt.Fprintf(
			os.Stderr,
			"\u274c\ufe0f %s\n",
			colors.Red(
				fmt.Sprintf(
					"Linter(s) reported violations: %s.",
					colors.B(strings.Join(violatingLinters, ", ")),
				),
			),
		)
		os.Exit(1)
	}
	if empty {
		fmt.Printf("\U0001f47b %s\n", colors.Yellow("No files to lint."))
		os.Exit(1)
	}
	if !quiet {
		fmt.Printf("\U0001f389 %s\n", colors.Green("All linters passed, no violation found."))
	}
	os.Exit(0)
	return nil
}
