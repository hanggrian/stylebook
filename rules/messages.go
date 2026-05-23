package rules

import (
	_ "embed"
	"encoding/json"
	"sync"
)

//go:embed resources/messages.json
var messagesJSON []byte

var (
	messages     map[string]string
	messagesOnce sync.Once
)

func loadMessages() {
	messages = map[string]string{}
	_ = json.Unmarshal(messagesJSON, &messages)
}

func GetMessage(key string) string {
	messagesOnce.Do(loadMessages)
	if v, ok := messages[key]; ok {
		return v
	}
	return key
}
