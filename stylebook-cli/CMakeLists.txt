cmake_minimum_required(VERSION 4.1)
project(stylebook)

set(CMAKE_CXX_STANDARD 26)
set(CMAKE_BUILD_TYPE Release)

set(BINARY "stylebook")
set(VERSION "0.2")

include(FetchContent)
FetchContent_Declare(cmrc GIT_REPOSITORY https://github.com/vector-of-bool/cmrc.git)
FetchContent_MakeAvailable(cmrc)
cmrc_add_resource_library(
        resources
        resources/hadolint.yaml
        resources/stylebookrc
)

find_package(Boost REQUIRED COMPONENTS program_options)
add_executable(
        stylebook
        src/command/base.h
        src/command/hadolint.h
        src/command/shellcheck.h
        src/command/xmllint.h
        src/cli.h
        src/colors.cpp
        src/colors.h
        src/files.cpp
        src/files.h
        src/main.cpp
)
target_include_directories(
        stylebook
        PRIVATE
        "${CMAKE_BINARY_DIR}"
)
target_link_libraries(
        stylebook
        PRIVATE
        resources
        Boost::program_options
)
target_compile_definitions(
        stylebook
        PRIVATE
        APP_BINARY="${BINARY}"
        APP_VERSION="${VERSION}"
)
