package command

import (
	"fmt"
	"os"

	"github.com/spf13/viper"
	"golang.stackrox.io/kube-linter/pkg/builtinchecks"
	"golang.stackrox.io/kube-linter/pkg/checkregistry"
	"golang.stackrox.io/kube-linter/pkg/config"
	"golang.stackrox.io/kube-linter/pkg/configresolver"
	"golang.stackrox.io/kube-linter/pkg/lintcontext"
	"golang.stackrox.io/kube-linter/pkg/run"

	_ "golang.stackrox.io/kube-linter/pkg/templates/all"
)

type KubeLinterCommand struct {
	BaseCommand
}

// CLI executor for [KubeLinter](https://github.com/stackrox/kube-linter/).
var KubeLinter = KubeLinterCommand{
	BaseCommand: BaseCommand{
		Binary:     "kube-linter",
		ConfigFile: new("kubelinter-config.yaml"),
	},
}

func (c *KubeLinterCommand) IsAvailable() bool {
	return true
}

func (c *KubeLinterCommand) Execute(l Linter, targetPaths []string, quiet bool) int {
	checkRegistry := checkregistry.New()
	if err := builtinchecks.LoadInto(checkRegistry); err != nil {
		fmt.Fprintln(os.Stderr, err)
		return 1
	}

	cfg, err := config.Load(viper.New(), c.GetConfigFile())
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return 1
	}

	enabledChecks, err := configresolver.GetEnabledChecksAndValidate(&cfg, checkRegistry)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return 1
	}

	ignorePaths, err := configresolver.GetIgnorePaths(&cfg)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return 1
	}

	lintCtxs, err := lintcontext.CreateContexts(ignorePaths, targetPaths...)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return 1
	}

	result, err := run.Run(lintCtxs, checkRegistry, enabledChecks)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return 1
	}

	for _, report := range result.Reports {
		filePath := report.Object.Metadata.FilePath
		msg := report.Diagnostic.Message
		fmt.Fprintf(
			os.Stderr,
			"%s %s (%s)\n",
			embedPath(filePath, 1, 1),
			msg,
			report.Check,
		)
	}
	if len(result.Reports) > 0 {
		return 1
	}
	return 0
}
