//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

import * as assert from 'assert';
import * as processor from '../src/processor';

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", () => {

    test("Get title from url", async () => {
        const google = await processor.process('https://www.google.com');
        assert.equal("Google", google.title);
    });

    test("Get title from github.com", async () => {
        const google = await processor.process('https://github.com/keltroth/PasteURL');
        assert.equal("A VSCode extension for pasting url in markdown-style.", google.title);
    });

});