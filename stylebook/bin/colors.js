import chalk from 'chalk';

function cyan(content) {
    return chalk.cyan(content);
}

function blue(content) {
    return chalk.blue(content);
}

function green(content) {
    return chalk.green(content);
}

function red(content) {
    return chalk.red(content);
}

function d(content) {
    return chalk.dim(content);
}

function b(content) {
    return chalk.bold(content);
}

function i(content) {
    return chalk.italic(content);
}

export { cyan, blue, b, d, i, green, red };
