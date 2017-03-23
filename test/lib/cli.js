'use strict';

const CommandLine = require('../../lib/cli');
const assert = require('assert');
const os = require('os');
const path = require('path');

describe('CommandLine', function() {
    let sut;

    beforeEach(function() {
        sut = new CommandLine(process);
    });

    describe('_findConfigPath', function() {
        it('should return the directory\'s config path if .jflintrc exists in the directory', function() {
            const dir = path.normalize(`${__dirname}/../resources/jflintrc-exist`);
            assert(sut._findConfigPath(dir) === path.join(dir, '.jflintrc'));
        });

        it('should return the parent directory\'s config path if .jflintrc exists in the parent directory', function() {
            const dir = path.normalize(`${__dirname}/../resources/jflintrc-exist/jflintrc-not-exist`);
            const parentDir = path.normalize(`${__dirname}/../resources/jflintrc-exist`);
            assert(sut._findConfigPath(dir) === path.join(parentDir, '.jflintrc'));
        });

        it('should return the home directory\'s config path if .jflintrc does not exist from the directory up to the root', function() {
            // setup
            sut._isFileExist = () => false;

            // exercise & verify
            const dir = path.normalize(`${__dirname}`);
            assert(sut._findConfigPath(dir) === path.join(os.homedir(), '.jflintrc'));
        });
    });
});
