'use strict';

const CommandLine = require('../../lib/cli');
const assert = require('assert');
const os = require('os');
const path = require('path');
const sinon = require('sinon');
const chai = require('chai');
chai.use(require('sinon-chai'));

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

    describe('_interpretResult', function() {
        beforeEach(function() {
            sut._process = {
                stdout: { write: sinon.stub() },
                stderr: { write: sinon.stub() },
                exit: sinon.stub()
            };
        });

        it('should handle success response from Linux node', function() {
            const res = 'Jenkinsfile successfully validated.\n';
            sut._interpretResult(res);

            chai.expect(sut._process.exit).to.be.calledWith(0);
        });

        it('should handle success response from Windows node', function() {
            const res = 'Jenkinsfile successfully validated.\r\n';
            sut._interpretResult(res);

            chai.expect(sut._process.exit).to.be.calledWith(0);
        });
    });
});
