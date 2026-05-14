prepare:
  mkdir -p stylebook-cli/build/ && cd stylebook-cli/build/ && cmake .. -G Ninja

build:
  cd stylebook-cli/build/ && cmake --build .

lint:
  stylebook-cli/build/stylebook sample/
