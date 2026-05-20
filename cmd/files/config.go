package files

import (
	"os"
	"path/filepath"
)

func GetConfigFile(configFile string) string {
	cwd, _ := os.Getwd()
	localConfigFile := filepath.Join(cwd, "."+configFile)
	if info, err := os.Stat(localConfigFile); err == nil && !info.IsDir() {
		return localConfigFile
	}
	return filepath.Join(cwd, "cmd", "resources", configFile)
}
