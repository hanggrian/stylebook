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
            const filteredLines: string[] = [];
            let isCodeFence = false;
            lines.forEach(line => {
                if (StylebookRule.CODE_FENCE_REGEX.test(line)) {
                    isCodeFence = !isCodeFence;
                    return;
                }
                if (!isCodeFence) {
                    filteredLines.push(line);
                }
            });
            this.visit(filteredLines, onError);
        };

    abstract visit(lines: readonly string[], onError: RuleOnError): void;

    private static CODE_FENCE_REGEX: RegExp = /```\w*/g;
}

export default StylebookRule;
