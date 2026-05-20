# DISABLED maxbodylength: target body exceeds 5 lines
long_target:
	@echo "line 1"
	@echo "line 2"
	@echo "line 3"
	@echo "line 4"
	@echo "line 5"
	@echo "line 6"

# ENABLED minphony: "all", "clean", "test" are declared .PHONY
.PHONY: all clean test
all:
	@echo "all"

clean:
	@echo "clean"

test:
	@echo "test"

# ENABLED phonydeclared: build has no output file and is not declared .PHONY
build:
	@echo "building..."

# ENABLED uniquetargets: same target defined twice
duplicate:
	@echo "first definition"
