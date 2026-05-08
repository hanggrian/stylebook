#ifndef CLI_H
#define CLI_H

#include <iostream>
#include <string>

inline int die(const std::string &msg) {
    std::cerr << msg << std::endl;
    return 1;
}

inline void warn(const std::string &msg) {
    std::cerr << msg << std::endl;
}

#endif
