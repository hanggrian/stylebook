package cmd

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/hanggrian/stylebook/cmd/commands"
)

var Version = "0.2"

func Execute() error {
	inputArgs := os.Args[1:]
	if len(inputArgs) == 0 {
		fmt.Fprintln(os.Stderr, Red("Need a path."))
		os.Exit(1)
	}
	var exclude []string
	var quiet bool
	var remainingArgs []string
	for _, arg :=
		range inputArgs {
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
		if file, err := os.Open(".stylebookrc"); err == nil {
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
			file.Close()
		}
	}
	for _, arg :=
		range remainingArgs {
			if arg == "-h" ||
				arg == "--help" {
				fmt.Printf("Helper for Stylebook linter extensions\n\n")
				fmt.Printf("\U0001f680 %s\n", Bold("Usage:"))
				fmt.Printf("   stylebook %s %s\n\n", Cyan("<paths>"), Blue("[options]"))
				fmt.Printf("\U0001f4c4 %s\n", Bold(Cyan("Paths:")))
				fmt.Printf("   file      Supports %s\n", Italic(".csv"))
				fmt.Printf("   dir       Recursively find files in this directory\n")
				fmt.Printf(
					"   pattern   For example, %s for all CSV files in this\n",
					Italic("*.csv"),
				)
				fmt.Printf("             directory, %s for all files\n\n", Italic("**/*"))
				fmt.Printf("\u2699\ufe0f  %s\n", Bold(Blue("Options:")))
				fmt.Printf("   -e  [ --exclude ] arg   List of files or directories to ignore\n")
				fmt.Printf("   -h  [ --help ]          Display this message\n")
				fmt.Printf("   -q  [ --quiet ]         Disable verbose output\n")
				fmt.Printf("   -v  [ --version ]       Show app version\n")
				os.Exit(0)
			}
			if arg == "-v" ||
				arg == "--version" {
				fmt.Printf("stylebook %s\n", Bold(Version))
				os.Exit(0)
			}
			if arg == "-q" ||
				arg == "--quiet" {
				quiet = true
			}
		}
	csvlint := commands.NewCsvlintCommand()
	cmdMap := make(map[string][]string)
	cmdMap[csvlint.GetBinary()] = []string{}
	order := []string{csvlint.GetBinary()}
	for _, arg := range remainingArgs {
		if arg == "-q" ||
			arg == "--quiet" {
			continue
		}
		for _, path :=
			range walk(arg, exclude) {
				if strings.ToLower(filepath.Ext(path)) == ".csv" {
					cmdMap[csvlint.GetBinary()] = append(cmdMap[csvlint.GetBinary()], path)
				}
			}
	}
	if !quiet {
		for _, binaryName :=
			range order {
				title := Bold(binaryName)
				if !csvlint.IsAvailable() {
					fmt.Printf("\U0001f6ab %s: Unavailable\n", title)
					continue
				}
				paths := cmdMap[binaryName]
				if len(paths) == 0 {
					fmt.Printf("\U0001fad9 %s: Empty\n", title)
					continue
				}
				fmt.Printf("\u2705\ufe0f %s:\n", title)
				for _, path := range paths {
					ext := filepath.Ext(path)
					root := path[:len(path)-len(ext)]
					slash := strings.LastIndex(root, "/") + 1
					fmt.Printf("   %s%s%s\n", Dim(root[:slash]), root[slash:], Italic(ext))
				}
			}
		fmt.Println()
	}
	empty := true
	var violatingLinters []string
	for _, binaryName :=
		range order {
			paths := cmdMap[binaryName]
			if !csvlint.IsAvailable() || len(paths) == 0 {
				continue
			}
			empty = false
			if csvlint.Execute(csvlint, quiet, paths) != 0 {
				violatingLinters = append(violatingLinters, csvlint.GetBinary())
			}
		}
	if len(violatingLinters) > 0 {
		fmt.Fprintf(
			os.Stderr,
			"\u274c\ufe0f %s\n",
			Red(
				fmt.Sprintf(
					"Linter(s) reported violations: %s.",
					Bold(strings.Join(violatingLinters, ", ")),
				),
			),
		)
		os.Exit(1)
	}
	if empty {
		fmt.Printf("\U0001f47b %s\n", Yellow("No files to lint."))
		os.Exit(1)
	}
	fmt.Printf("\U0001f389 %s\n", Green("All linters passed, no violation found."))
	os.Exit(0)
	return nil
}

func walk(targetPath string, exclude []string) []string {
	cleaned := filepath.Clean(targetPath)
	parts := strings.Split(cleaned, string(os.PathSeparator))
	for _, part :=
		range parts {
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
	for _, entry :=
		range entries {
			files = append(files, walk(filepath.Join(cleaned, entry.Name()), exclude)...)
		}
	return files
}
