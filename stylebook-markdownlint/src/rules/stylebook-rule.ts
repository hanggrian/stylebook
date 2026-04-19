import type { Rule, RuleOnError, RuleParams } from 'markdownlint';

abstract class StylebookRule implements Rule {
    readonly names: string[];
    readonly description: string;
    readonly tags: string[];
    readonly parser: 'markdownit' | 'micromark' | 'none' = 'markdownit';

    protected constructor(name: string, group: string) {
        this.names = [name];
        this.description = `https://hanggrian.github.io/stylebook/rules/#${name}`;
        this.tags = [group];
    }

    abstract function: (params: RuleParams, onError: RuleOnError) => void;
}

export default StylebookRule;
