package files

import (
	"os"
	"path/filepath"
	"sync"

	"github.com/hanggrian/stylebook/cmd/resources"
)

var embeddedConfigFiles sync.Map

func GetConfigFile(configFile string) string {
	cwd, _ := os.Getwd()
	localConfigFile := filepath.Join(cwd, "."+configFile)
	if info, err := os.Stat(localConfigFile); err == nil && !info.IsDir() {
		return localConfigFile
	}
	if embeddedConfigFile := getEmbeddedConfigFile(configFile); embeddedConfigFile != "" {
		return embeddedConfigFile
	}
	return filepath.Join(cwd, "cmd", "resources", configFile)
}

func getEmbeddedConfigFile(configFile string) string {
	if value, ok := embeddedConfigFiles.Load(configFile); ok {
		return value.(string)
	}
	data, err := resources.Read(configFile)
	if err != nil {
		return ""
	}
	tempDir := filepath.Join(os.TempDir(), "stylebook")
	if err := os.MkdirAll(tempDir, 0o755); err != nil {
		return ""
	}
	embeddedConfigFile := filepath.Join(tempDir, configFile)
	if existing, err := os.ReadFile(embeddedConfigFile); err == nil && string(existing) == string(data) {
		embeddedConfigFiles.Store(configFile, embeddedConfigFile)
		return embeddedConfigFile
	}
	if err := os.WriteFile(embeddedConfigFile, data, 0o644); err != nil {
		return ""
	}
	embeddedConfigFiles.Store(configFile, embeddedConfigFile)
	return embeddedConfigFile
}
