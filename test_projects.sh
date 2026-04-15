#!/bin/bash

RED="$(tput setaf 1)" && readonly RED
GREEN="$(tput setaf 2)" && readonly GREEN
YELLOW="$(tput setaf 3)" && readonly YELLOW
END="$(tput sgr0)" && readonly END

warn() { echo "$YELLOW$*$END"; } >&2
die() { echo; echo "$RED$*$END"; echo; exit 1; } >&2

SOURCE_ROOT="$(cd "$(dirname "$0")" && pwd)" && readonly SOURCE_ROOT
APPLICATION="$(cd "$SOURCE_ROOT/react-application" && pwd)" \
  && readonly APPLICATION
LIBRARY="$(cd "$SOURCE_ROOT/react-library" && pwd)" && readonly LIBRARY

build_website() {
  cd 'website' || exit 1
  bundle install
  bundle exec jekyll build
}

COVERAGE_FILE='test-report.junit.xml' && readonly COVERAGE_FILE
TYPEDOC_DIR='docs/' && readonly TYPEDOC_DIR
JEKYLL_DIR='website/_site/' && readonly JEKYLL_DIR

warn 'Testing application...'

echo '(1/3) Running PNPM commands'
cd "$APPLICATION" || exit 1
pnpm i
pnpm build
pnpm lint
pnpm test
pnpm coverage
build_website
cd "$APPLICATION" || exit 1

echo '(2/3) Checking coverage file'
coverage_file='test-report.junit.xml'
if [[ ! -e "$coverage_file" ]]; then
  die 'Coverage not found.'
fi

echo '(3/3) Checking website directory'
if [[ ! -e "$JEKYLL_DIR" ]]; then
  die 'Website not built.'
fi

warn 'Testing library...'

echo '(1/4) Running PNPM commands'
cd "$LIBRARY" || exit 1
pnpm i
pnpm lint
pnpm -r test
pnpm -r coverage
pnpm doc
build_website
cd "$LIBRARY" || exit 1

echo '(2/4) Checking coverage file'
if [[ ! -e "packages/library/$COVERAGE_FILE" ||
  ! -e "packages/library-extension/$COVERAGE_FILE" ]]; then
  die 'Coverage not found.'
fi

echo '(3/4) Checking documentation directory'
if [[ ! -e "$TYPEDOC_DIR" ]]; then
  die 'Documentation not built.'
fi

echo '(4/4) Checking website directory'
if [[ ! -e "$JEKYLL_DIR" ]]; then
  die 'Website not built.'
fi

echo "${GREEN}Tests complete.$END"
echo
echo 'Goodbye!'
