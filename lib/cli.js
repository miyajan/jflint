'use strict';

const commander = require('commander');
const JFLint = require('../index');
const pkg = require('../package.json');
const fs = require('fs');
const os = require('os');
const path = require('path');

class CommandLine {
    /**
     * Constructor
     * @param {!NodeJS.Process} process Process
     */
    constructor(process) {
        this._process = process;
        this._program = new commander.Command();
    }

    /**
     * Execute a command
     */
    execute() {
        this._program
            .version(pkg.version, '-v, --version')
            .usage('[options] Jenkinsfile')
            .option('-j, --jenkins-url <url>', 'Jenkins URL')
            .option('-u, --username <username>', 'Username for Jenkins')
            .option('-p, --password <password>', 'Password or API Token for Jenkins')
            .option('--csrf-disabled', 'Specify if CSRF prevention is disabled on Jenkins')
            .option('-c, --config <path>', 'Path to config json file');

        this._program.parse(this._process.argv);

        if (this._program.args.length !== 1) {
            this._program.outputHelp();
            this._process.exit(1);
        }

        const jenkinsfile = this._program.args[0];

        let config = {};
        const configPath = this._program.config || this._findConfigPath(this._process.cwd());
        try {
            config = JSON.parse(fs.readFileSync(configPath));
        } catch (e) {
            if (this._program.config) {
                // only throw when config path is specified by an option
                this._process.stderr.write(`Error! Can't read config ${configPath}\n`);
                this._process.exit(1);
            }
        }

        const jenkinsUrl = this._program.jenkinsUrl || config.jenkinsUrl;
        const username = this._program.username || config.username;
        const password = this._program.password || config.password;
        const csrfDisabled = this._program.csrfDisabled || config.csrfDisabled;

        if (!jenkinsUrl) {
            this._program.outputHelp();
            this._process.exit(1);
        }

        const jflint = new JFLint(jenkinsUrl, username, password, csrfDisabled);
        return jflint.lintJenkinsfile(jenkinsfile).then(res => {
            if (res === 'Jenkinsfile successfully validated.\n') {
                this._process.stdout.write(res);
                this._process.exit(0);
            } else {
                this._process.stderr.write(res);
                this._process.exit(1);
            }
        }).catch(e => {
            this._process.stderr.write(`${e.message}\n`);
            this._process.exit(1);
        });
    }

    _findConfigPath(dir) {
        const name = '.jflintrc';
        const filename = path.normalize(path.join(dir, name));
        if (this._isFileExist(filename)) {
            return filename;
        }

        const parent = path.resolve(dir, '../');
        if (dir === parent) {
            return path.join(os.homedir(), '.jflintrc');
        }

        return this._findConfigPath(parent);
    }

    _isFileExist(path) {
        try {
            fs.statSync(path);
            return true;
        } catch (e) {
            return false;
        }
    }
}

module.exports = CommandLine;
