#ifndef FILES_H
#define FILES_H

#include <string>

/**
 * Returns local configuration file if it exists. Otherwise, use the default file in the resources
 * directory.
 */
std::string get_config_file(const std::string &config_file);

#endif // FILES_H
