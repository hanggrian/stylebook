#ifndef HADOLINT_H
#define HADOLINT_H

#include "base.h"
#include <vector>

using namespace std;

class HadolintCommand : public Command {
public:
    HadolintCommand() : Command("hadolint", "hadolint.yaml") {
    }

    [[nodiscard]] vector<string> get_arguments(
        const bool quiet,
        const vector<string> &target_paths
        ) const override {
        vector<string> arguments = {"-c", config_file};
        arguments.insert(arguments.end(), target_paths.begin(), target_paths.end());
        return arguments;
    }
};

#endif // HADOLINT_H
