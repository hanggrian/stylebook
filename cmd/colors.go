package cmd

import "fmt"

func Bold(text string) string {
	return fmt.Sprintf("\033[1m%s\033[22m", text)
}

func Dim(text string) string {
	return fmt.Sprintf("\033[2m%s\033[22m", text)
}

func Italic(text string) string {
	return fmt.Sprintf("\033[3m%s\033[23m", text)
}

func Red(text string) string {
	return fmt.Sprintf("\033[31m%s\033[39m", text)
}

func Green(text string) string {
	return fmt.Sprintf("\033[32m%s\033[39m", text)
}

func Yellow(text string) string {
	return fmt.Sprintf("\033[33m%s\033[39m", text)
}

func Blue(text string) string {
	return fmt.Sprintf("\033[34m%s\033[39m", text)
}

func Cyan(text string) string {
	return fmt.Sprintf("\033[36m%s\033[39m", text)
}
