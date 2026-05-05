#include <boost/program_options.hpp>
#include <algorithm>
#include <array>
#include <filesystem>
#include <fstream>
#include <iostream>
#include <set>
#include <sstream>
#include <string>
#include <vector>
#include "cli.h"
#include "colors.h"
#include "command/shellcheck.h"
#include "command/xmllint.h"
#include "files.h"

using namespace boost::program_options;
using namespace std;
using namespace std::filesystem;

vector<string> walk(const path &target_path, const set<string> &exclude) {
    for (const auto &part: target_path) {
        if (exclude.contains(part.string())) {
            return {};
        }
    }

    if (is_regular_file(target_path)) {
        return {target_path.string()};
    }

    if (is_directory(target_path)) {
        vector<string> files;
        for (const auto &child: directory_iterator(target_path)) {
            const vector<string> child_files = walk(child.path(), exclude);
            files.insert(files.end(), child_files.begin(), child_files.end());
        }
        return files;
    }

    return {};
}

set<string> read_config_excludes(const string &config_file) {
    set<string> excludes;
    ifstream file(config_file);

    if (!file.is_open()) {
        return excludes;
    }

    string line;
    while (getline(file, line)) {
        line.erase(0, line.find_first_not_of(" \t\r\n"));
        line.erase(line.find_last_not_of(" \t\r\n") + 1);

        if (line.empty() || line[0] == '#') {
            continue;
        }

        if (line.back() == '/') {
            line.pop_back();
        }

        excludes.insert(line);
    }

    return excludes;
}

int main(const int argc, char **argv) {
    // parse input arguments
    if (argc < 2) {
        cerr << red("Need a path.") << endl;
        return 1;
    }
    options_description options("\u2699\ufe0f  " + b(blue("Options")));
    options.add_options()
            ("exclude,e", value<string>(), "List of files or directories to ignore")
            ("help,h", "Display this message")
            ("quiet,q", bool_switch()->default_value(false), "Disable verbose output")
            ("version,v", "Show app version");
    options_description hidden;
    hidden.add_options()
            ("path", value<vector<string> >());
    options_description all;
    all.add(options).add(hidden);
    positional_options_description positional;
    positional.add("path", -1);
    variables_map variables;
    parsed_options parsed =
            command_line_parser(argc, argv)
            .options(all)
            .positional(positional)
            .run();
    try {
        store(parsed, variables);
        notify(variables);
    } catch (error &e) {
        return die(e.what());
    }
    if (variables.contains("version")) {
        cout << APP_BINARY << " " << b(APP_VERSION) << endl;
        return 0;
    }
    if (variables.contains("help")) {
        cout << "Helper for Stylebook linter extensions" << endl << endl;
        cout << b("\U0001f680 Usage:") << endl;
        cout <<
                "   " <<
                APP_BINARY <<
                " " <<
                cyan("<paths>") <<
                " " <<
                blue("[options]") <<
                endl <<
                endl;
        cout << b(cyan("\U0001f4c4 Paths:")) << endl;
        cout <<
                "   file      Supports " <<
                i(".bash") <<
                ", " <<
                i(".sh") <<
                ", " <<
                i(".xml") <<
                endl;
        cout << "   dir       Recursively find files in this directory" << endl;
        cout <<
                "   pattern   For example, " <<
                i("*.json") <<
                " for all JSON files in this" <<
                endl;
        cout << "             directory, " << i("**/*") << " for all files" << endl << endl;
        stringstream ss;
        ss << options;
        string line;
        bool header_passed = false;
        while (getline(ss, line)) {
            if (!header_passed) {
                if (line.find(':') != string::npos) header_passed = true;
                cout << line << endl;
                continue;
            }
            cout << " " << line << endl;
        }
        return 0;
    }
    const bool quiet = variables["quiet"].as<bool>();
    set<string> exclude;
    if (variables.contains("exclude")) {
        const string exclude_arg = variables["exclude"].as<string>();
        stringstream ss(exclude_arg);
        string item;
        while (getline(ss, item, ',')) {
            if (!item.empty()) {
                exclude.insert(item);
            }
        }
    }
    if (exclude.empty()) {
        exclude = read_config_excludes(get_config_file("stylebookrc"));
    }
    const vector<string> input_args =
            !variables.contains("path")
                ? vector<string>{}
                : variables["path"].as<vector<string> >();
    if (input_args.empty()) {
        cerr << red("Need a path.") << endl;
        return 1;
    }
    Shellcheck shellcheck;
    Xmllint xmllint;

    // insert target paths to corresponding command
    const array<Command *, 2> commands = {&shellcheck, &xmllint};
    vector<string> shellcheck_paths;
    vector<string> xmllint_paths;
    for (const auto &input_arg: input_args) {
        for (const vector<string> files = walk(path(input_arg), exclude); const auto &file: files) {
            path filepath(file);
            string ext = filepath.extension().string();
            ranges::transform(ext, ext.begin(), ::tolower);
            if (ext == ".sh" || ext == ".bash") {
                shellcheck_paths.push_back(file);
            } else if (ext == ".xml" || ext == ".svg") {
                xmllint_paths.push_back(file);
            }
        }
    }

    // filter out commands with no target files
    if (!quiet) {
        for (const Command *cmd: commands) {
            const vector<string> &paths =
                    cmd->binary == shellcheck.binary ? shellcheck_paths : xmllint_paths;
            string title = b(cmd->binary);
            if (!cmd->is_available()) {
                cout << "\U0001f6ab " << title << ": Unavailable" << endl;
                continue;
            }
            if (paths.empty()) {
                cout << "\U0001fad9 " << title << ": Empty" << endl;
                continue;
            }
            cout << "\u2705\ufe0f " << title << endl;
            for (const auto &path: paths) {
                if (const size_t last_slash = path.rfind('/'); last_slash != string::npos) {
                    string dir = path.substr(0, last_slash + 1);
                    string filename = path.substr(last_slash + 1);
                    string ext = filesystem::path(filename).extension().string();
                    string base = filename.substr(0, filename.length() - ext.length());
                    cout << "   " << d(dir) << base << i(ext) << endl;
                } else {
                    cout << "   " << path << endl;
                }
            }
        }
        cout << endl;
    }

    // report result
    unsigned long total_length = 0;
    vector<string> violating_linters;
    for (Command *cmd: commands) {
        const vector<string> &paths =
                cmd->binary == shellcheck.binary
                    ? shellcheck_paths
                    : xmllint_paths;
        total_length += paths.size();
        if (cmd->is_available() && !paths.empty() && cmd->execute(quiet, paths)) {
            violating_linters.push_back(cmd->binary);
        }
    }
    if (!violating_linters.empty()) {
        string linters_str = violating_linters[0];
        for (size_t i = 1; i < violating_linters.size(); i++) {
            linters_str += ", " + violating_linters[i];
        }
        cerr <<
                "\u274C\ufe0f " <<
                red(string("Linter(s) reported violations: ") + b(linters_str + ".")) <<
                endl;
        return 1;
    }
    if (total_length == 0) {
        cout << "\U0001f47b " << yellow("No files to lint.") << endl;
        return 1;
    }
    cout << "\U0001f389 " << green("All linters passed, no violation found.") << endl;
    return 0;
}
