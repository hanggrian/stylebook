import type { Rule, RuleOnError, RuleParams } from 'markdownlint';

abstract class StylebookRule implements Rule {
    readonly names: string[];
    readonly description: string;
    readonly tags: string[];
    readonly parser: 'markdownit' | 'micromark' | 'none' = 'markdownit';

    protected constructor(name: string, group: string) {
        this.names = [name];
        this.description = `https://hanggrian.github.io/stylebook/rules/markdown/#${name}`;
        this.tags = [group];
    }

    function: (params: RuleParams, onError: RuleOnError) => void =
        (params, onError): void => {
            const { lines } = params;
            let isCodeFence = false;
            this.visit(
                lines.map(line => {
                    if (StylebookRule.CODE_FENCE_REGEX.test(line)) {
                        isCodeFence = !isCodeFence;
                    }
                    return isCodeFence
                        ? ''
                        : line;
                }),
                onError,
            );
        };

    abstract visit(lines: readonly string[], onError: RuleOnError): void;

    private static CODE_FENCE_REGEX: RegExp = /^```/;
}

export default StylebookRule;
