package command

var Names = func() map[string]struct{} {
	names := make(map[string]struct{})
	for _, linter := range []Linter{
		&Checkmake,
		&Chktex,
		&Csvlint,
		&Gomoddirectives,
		&Hadolint,
		&Propertieslint,
		&Protolint,
		&Shellcheck,
		&Tflint,
		&Xmllint,
	} {
		names[linter.GetBinary()] = struct{}{}
	}
	return names
}()
