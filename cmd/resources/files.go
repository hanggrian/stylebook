package resources

import (
	"embed"
	"fmt"
	"io/fs"
)

//go:embed *.ini *.json *.yaml *.hcl *rc
var embeddedFiles embed.FS

func Read(name string) ([]byte, error) {
	data, err := fs.ReadFile(embeddedFiles, name)
	if err != nil {
		return nil, fmt.Errorf("Read embedded resource %s: %w", name, err)
	}
	return data, nil
}
