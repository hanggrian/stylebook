#ifndef BASE_H
#define BASE_H

#include "../files.h"
#include <cerrno>
#include <cstdlib>
#include <filesystem>
#include <optional>
#include <string>
#include <sys/wait.h>
#include <unistd.h>
#include <utility>
#include <vector>

class Command {
public:
    virtual ~Command() = default;

    std::string binary;
    std::string config_file;

    explicit Command(
        std::string binary,
        const std::optional<std::string> &config_file = std::nullopt
    ) : binary(std::move(binary)),
        config_file(config_file.has_value() ? get_config_file(config_file.value()) : "") {
    }

    static std::string search_path(const std::string &bin) {
        const char *path_env = std::getenv("PATH");
        if (!path_env) {
            return {};
        }
        std::string path(path_env);
        size_t start = 0;
        while (start < path.size()) {
            size_t pos = path.find(':', start);
            if (pos == std::string::npos) pos = path.size();
            std::string dir = path.substr(start, pos - start);
            std::filesystem::path candidate = std::filesystem::path(dir) / bin;
            if (access(candidate.c_str(), X_OK) == 0) {
                return candidate.string();
            }
            start = pos + 1;
        }
        return {};
    }

    [[nodiscard]] bool is_available() const {
        return !search_path(binary).empty();
    }

    [[nodiscard]] virtual std::vector<std::string> get_arguments(
        bool quiet,
        const std::vector<std::string> &target_paths
    ) const = 0;

    [[nodiscard]] int execute(
        const bool quiet,
        const std::vector<std::string> &target_paths
    ) const {
        const std::vector<std::string> arguments = get_arguments(quiet, target_paths);
        const std::string exe = search_path(binary);
        if (exe.empty()) {
            return 127;
        }

        std::vector<char *> argv;
        argv.reserve(arguments.size() + 2);
        argv.push_back(const_cast<char *>(exe.c_str()));
        for (const auto &arg: arguments) {
            argv.push_back(const_cast<char *>(arg.c_str()));
        }
        argv.push_back(nullptr);

        const pid_t pid = fork();
        if (pid == -1) {
            return errno;
        }
        if (pid == 0) {
            execv(exe.c_str(), argv.data());
            _exit(errno ? errno : 1);
        }

        int status = 0;
        if (waitpid(pid, &status, 0) == -1) {
            return errno;
        }
        if (WIFEXITED(status)) {
            return WEXITSTATUS(status);
        }
        if (WIFSIGNALED(status)) {
            return 128 + WTERMSIG(status);
        }
        return status;
    }
};

#endif
