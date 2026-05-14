#include "colors.h"

#define RESET "\033[0m"
#define BOLD "\033[1m"
#define DIM "\033[2m"
#define ITALIC "\033[3m"
#define CYAN "\033[36m"
#define BLUE "\033[34m"
#define GREEN "\033[32m"
#define RED "\033[31m"
#define YELLOW "\033[33m"

using namespace std;

string cyan(const string &content) {
    return CYAN + content + RESET;
}

string blue(const string &content) {
    return BLUE + content + RESET;
}

string green(const string &content) {
    return GREEN + content + RESET;
}

string red(const string &content) {
    return RED + content + RESET;
}

string yellow(const string &content) {
    return YELLOW + content + RESET;
}

string d(const string &content) {
    return DIM + content + RESET;
}

string b(const string &content) {
    return BOLD + content + RESET;
}

string i(const string &content) {
    return ITALIC + content + RESET;
}
