import Command from './command.js';
import { readFileSync } from 'node:fs';
import runner from 'graphql-schema-linter/lib/runner.js';

/**
 * CLI executor for
 * <a href="https://github.com/cjoudrey/graphql-schema-linter/">graphql-schema-linter</a>.
 */
class GraphqlSchemaLinterCommand extends Command {
    constructor() {
        super('graphql-schema-linter', 'graphql-schema-linterrc');
    }

    isAvailable() {
        return true;
    }

    // eslint-disable-next-line no-unused-vars
    async execute(rootDir, targetPaths, quiet) {
        return runner.run(
            process.stdout,
            process.stdin,
            process.stderr,
            [
                '',
                '',
                '-r',
                JSON.parse(readFileSync(this.configFile, 'UTF-8')).rules.join(','),
                 ...targetPaths,
            ],
        );
    }
}

export default GraphqlSchemaLinterCommand;
