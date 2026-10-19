.PHONY: install lint test cov format doc

install:
	@if [ "$(CLEAN)" = "true" ]; then \
		go mod download; \
	else \
		go mod tidy; \
	fi

lint:
	go run . .

test:
	go test ./rules/...

cov:
	go test -coverprofile=coverage.out ./rules/...

format:
	go fmt ./...

doc:
	rm -rf build/doc2go/
	go run go.abhg.dev/doc2go@v0.12.2 -out build/doc2go/ ./rules/...
