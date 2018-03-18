# jflint

A helper tool to lint a Declarative Jenkinsfile

[![npm version](https://img.shields.io/npm/v/jflint.svg)](https://www.npmjs.com/package/jflint)
[![npm downloads](https://img.shields.io/npm/dm/jflint.svg)](https://www.npmjs.com/package/jflint)
![Node.js Version Support](https://img.shields.io/badge/Node.js%20support-v4–v7-brightgreen.svg)
[![Build Status](https://travis-ci.org/miyajan/jflint.svg?branch=master)](https://travis-ci.org/miyajan/jflint)
[![dependencies Status](https://david-dm.org/miyajan/jflint/status.svg)](https://david-dm.org/miyajan/jflint)
[![Coverage Status](https://coveralls.io/repos/github/miyajan/jflint/badge.svg?branch=master)](https://coveralls.io/github/miyajan/jflint?branch=master)
![License](https://img.shields.io/npm/l/jflint.svg)

## Description

This tool helps to lint a Declarative Jenkinsfile.

[The official document](https://github.com/jenkinsci/pipeline-model-definition-plugin/wiki/Validating-(or-linting)-a-Declarative-Jenkinsfile-from-the-command-line) provides a ssh approach and a curl approach to lint a Declarative Jenkinsfile. However, both approaches are a bit complicated for daily use.

So I created this tool to lint easily. **This tool itself does not lint a Jenkinsfile, but sends a request to Jenkins in the same way as curl approach and displays the result**.

## Install

```
$ npm install jflint -g
```

## Usage

```
$ jflint [options] /path/to/Jenkinsfile
```

## Options

### ```-j``` or ```--jenkins-url```

Specify the URL of Jenkins to lint Jenkinsfile. The URL must be passed by this option or a config file.

### ```-u``` or ```--username```

Specify username for Jenkins. Username is required when security is enabled on Jenkins.

### ```-p``` or ```--password```

Specify password or [API token](https://wiki.jenkins-ci.org/display/JENKINS/Authenticating+scripted+clients) for Jenkins. Password or API token is required when security is enabled on Jenkins.

### ```--csrf-disabled```

Specify this options when CSRF security setting is disabled on Jenkins.

### ```-c``` or ```--config```

Specify a path to config file.

### ```--ssl-verification-disabled```

Disable SSL verification.

## Config file

You can load options from json file like the following.

```json
{
  "jenkinsUrl": "http://jenkins.example.com",
  "username": "admin",
  "password": "p@ssword"
}
```

Config file is searched in the following order.

* the path specified by ```-c|--config```
* ```.jflintrc``` from the current directory all the way up to the filesystem root
* ```${HOME}/.jflintrc```

If the same setting is specified in both option and config file, the option setting overrides the config setting.

## Contribution

1. Fork
2. Create a feature branch
3. Commit your changes
4. Rebase your local changes against the master branch
5. Run `npm test`
6. Create new Pull Request

## License

MIT

## Author

[miyajan](https://github.com/miyajan): Jumpei Miyata miyajan777@gmail.com
