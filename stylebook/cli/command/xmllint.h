#ifndef XMLLINT_H
#define XMLLINT_H

#include "base.h"
#include <vector>

using namespace std;

class Xmllint : public Command {
public:
    Xmllint() : Command("xmllint") {
    }

    [[nodiscard]] vector<string> get_arguments(
        const bool quiet,
        const vector<string> &target_paths
    ) const override {
        vector<string> arguments = {"--noout"};
        arguments.insert(arguments.end(), target_paths.begin(), target_paths.end());
        return arguments;
    }
};

#endif // XMLLINT_H
