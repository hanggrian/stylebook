import chalk from 'chalk';

function cyan(content) {
    return chalk.cyan(content);
}

function blue(content) {
    return chalk.cyan(content);
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

export { cyan, blue, b, d, red, i };
