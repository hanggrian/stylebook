#ifndef SHELLCHECK_H
#define SHELLCHECK_H

#include "base.h"
#include <vector>

using namespace std;

class Shellcheck : public Command {
public:
    Shellcheck() : Command("shellcheck") {
    }

    [[nodiscard]] vector<string> get_arguments(
        const bool quiet,
        const vector<string> &target_paths
    ) const override {
        return target_paths;
    }
};

#endif // SHELLCHECK_H
