from colorama import Fore, Style


def cyan(content: str) -> str:
    return f'{Fore.CYAN}{content}{Style.RESET_ALL}'


def blue(content: str) -> str:
    return f'{Fore.BLUE}{content}{Style.RESET_ALL}'


def green(content: str) -> str:
    return f'{Fore.GREEN}{content}{Style.RESET_ALL}'


def red(content: str) -> str:
    return f'{Fore.RED}{content}{Style.RESET_ALL}'


def yellow(content: str) -> str:
    return f'{Fore.YELLOW}{content}{Style.RESET_ALL}'


def d(content: str) -> str:
    return f'{Style.DIM}{content}{Style.RESET_ALL}'


def b(content: str) -> str:
    return f'{Style.BRIGHT}{content}{Style.RESET_ALL}'


def i(content: str) -> str:
    return f'\033[3m{content}{Style.RESET_ALL}'
