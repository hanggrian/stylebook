package main

import (
	"os"

	"github.com/hanggrian/stylebook/cmd"
)

func main() {
	if err := cmd.Execute(); err != nil {
		os.Exit(1)
	}
}
