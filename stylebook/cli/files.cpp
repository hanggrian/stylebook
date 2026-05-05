#include "files.h"
#include <cmrc/cmrc.hpp>
#include <filesystem>
#include <fstream>

CMRC_DECLARE(resources);

using namespace cmrc;
using namespace std;
using namespace std::filesystem;

namespace {
    path embedded_config_path(const string &config_file) {
        const auto resource = resources::get_filesystem().open("resources/" + config_file);
        const path temp_dir = temp_directory_path() / "stylebook";
        const path temp_file = temp_dir / config_file;
        if (!is_regular_file(temp_file)) {
            create_directories(temp_dir);
            ofstream output(temp_file, ios::binary | ios::trunc);
            output << string(resource.begin(), resource.end());
        }
        return temp_file;
    }
}

string get_config_file(const string &config_file) {
    if (const path local_config_file = current_path() / ("." + config_file);
        is_regular_file(local_config_file)) {
        return local_config_file.string();
    }

    return embedded_config_path(config_file).string();
}
