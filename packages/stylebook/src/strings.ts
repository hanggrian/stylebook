function truncateOrExpand(input: string, length: number): string {
    if (input.length > length) {
        return input.slice(0, length - 3) + "...";
    }
    if (input.length < length) {
        return input + " ".repeat(length - input.length);
    }
    return input;
}

export { truncateOrExpand };
