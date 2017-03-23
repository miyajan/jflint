'use strict';

const fetch = require('node-fetch');

/**
 * Send a request.
 * @param {string} url
 * @param {string} method
 * @param {!Object} headers
 * @param {FormData=} opt_body
 * @return {!Thenable<string>}
 */
function request(url, method, headers, opt_body) {
    return fetch(url, {
        method: method,
        headers: headers,
        body: opt_body
    }).then(response => {
        if (response.ok) {
            return response.text();
        }
        return Promise.reject(new Error(`Request Error. (url: ${url}, statusText: ${response.statusText})`));
    });
}

module.exports = request;
