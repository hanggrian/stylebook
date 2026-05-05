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
        resources/stylebookrc
)

find_package(Boost REQUIRED COMPONENTS program_options)
add_executable(
        stylebook
        cli/command/base.h
        cli/command/shellcheck.h
        cli/command/xmllint.h
        cli/cli.h
        cli/colors.cpp
        cli/colors.h
        cli/files.cpp
        cli/files.h
        cli/main.cpp
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
)
target_compile_definitions(
        stylebook
        PRIVATE
        APP_VERSION="${VERSION}"
)
