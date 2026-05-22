package rules

import (
	"encoding/json"
	"os"
	"path/filepath"
	"sync"
)

var (
	messages     map[string]string
	messagesOnce sync.Once
)

func loadMessages() {
	messages = map[string]string{}
	path := filepath.Join("..", "resources", "messages.json")
	data, err := os.ReadFile(path)
	if err != nil {
		return
	}
	_ = json.Unmarshal(data, &messages)
}

func GetMessage(key string) string {
	messagesOnce.Do(loadMessages)
	if v, ok := messages[key]; ok {
		return v
	}
	return key
}
