'use strict';

const FormData = require('form-data');
const fs = require('fs');
const Base64 = require('js-base64').Base64;
const fetch = require('node-fetch');
const request = require('./lib/request');

class JFLint {
    /**
     * Constructor
     * @param {string} jenkinsUrl
     * @param {string=} opt_username
     * @param {string=} opt_password
     * @param {boolean=} opt_csrfDisabled
     */
    constructor(jenkinsUrl, opt_username, opt_password, opt_csrfDisabled) {
        this._jenkinsUrl = jenkinsUrl;
        this._username = typeof opt_username === 'string' ? opt_username : '';
        this._password = typeof opt_password === 'string' ? opt_password : '';
        this._csrfDisabled = !!opt_csrfDisabled;
    }

    /**
     * Lint Jenkinsfile
     * @param {string} path
     * @return {!Thenable.<string>}
     */
    lintJenkinsfile(path) {
        if (!this._csrfDisabled) {
            return this._getCrumbHeader().then(crumbHeader => {
                return this._validate(path, crumbHeader);
            });
        }
        return this._validate(path);
    }

    /**
     * @param {!Object} headers
     * @private
     */
    _appendAuthHeader(headers) {
        if (this._username.length > 0) {
            const auth = Base64.encode(`${this._username}:${this._password}`);
            headers['Authorization'] = `Basic ${auth}`;
        }
    }

    /**
     * @return {!Thenable.<string>}
     * @private
     */
    _getCrumbHeader() {
        const url = `${this._jenkinsUrl}/crumbIssuer/api/xml?xpath=concat(//crumbRequestField,":",//crumb)`;
        const headers = {};
        this._appendAuthHeader(headers);
        return request(url, 'GET', headers);
    }

    /**
     * @param {string} path
     * @param {string=} opt_crumbHeader
     * @return {!Thenable.<string>}
     * @private
     */
    _validate(path, opt_crumbHeader) {
        const url = `${this._jenkinsUrl}/pipeline-model-converter/validate`;
        const form = new FormData();
        form.append('jenkinsfile', fs.readFileSync(path));
        const headers = form.getHeaders();
        this._appendAuthHeader(headers);
        if (opt_crumbHeader) {
            const splits = opt_crumbHeader.split(':');
            headers[splits[0]] = splits[1];
        }
        return request(url, 'POST', headers, form);
    }
}

module.exports = JFLint;
