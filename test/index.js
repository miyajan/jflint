'use strict';

const FJLint = require('../index');
const proxyquire = require('proxyquire');
const assert = require('assert');
const FormData = require('form-data');

describe('FJLint', function() {
    describe('lintJenkinsfile', function() {
        let JFLint, actualUrl, actualMethod, actualHeaders, actualBody, expectedResponse;

        beforeEach(function() {
            actualUrl = [];
            actualMethod = [];
            actualHeaders = [];
            actualBody = [];
            expectedResponse = '';
            JFLint = proxyquire('../index', {
                './lib/request': function(url, method, headers, opt_body) {
                    actualUrl.push(url);
                    actualMethod.push(method);
                    actualHeaders.push(headers);
                    actualBody.push(opt_body);
                    if (url === 'http://jenkins.example.com/crumbIssuer/api/xml?xpath=concat(//crumbRequestField,":",//crumb)') {
                        return Promise.resolve('Jenkins-Crumb:hogehogefugafuga');
                    } else if (url === 'http://jenkins.example.com/pipeline-model-converter/validate') {
                        return Promise.resolve('Jenkinsfile successfully validated.\n');
                    }
                    assert(false);
                }
            })
        });

        it('send a request to Jenkins with authorization', function() {
            const sut = new JFLint('http://jenkins.example.com', 'admin', 'p@ssword');
            return sut.lintJenkinsfile('./test/Jenkinsfile').then(res => {
                // to get a crumb header and to lint
                assert(actualUrl.length === 2);

                // to get a crumb header
                assert(actualUrl[0] === 'http://jenkins.example.com/crumbIssuer/api/xml?xpath=concat(//crumbRequestField,":",//crumb)');
                assert(actualMethod[0] === 'GET');
                assert(actualHeaders[0]['Authorization'] === 'Basic YWRtaW46cEBzc3dvcmQ=');
                assert(actualBody[0] === undefined);

                // to lint
                assert(actualUrl[1] === 'http://jenkins.example.com/pipeline-model-converter/validate');
                assert(actualMethod[1] === 'POST');
                assert(actualHeaders[1]['Authorization'] === 'Basic YWRtaW46cEBzc3dvcmQ=');
                assert(actualHeaders[1]['Jenkins-Crumb'] === 'hogehogefugafuga');
                assert(actualBody[1] instanceof FormData);
            });
        });

        it('send a request to Jenkins without authorization', function() {
            const sut = new JFLint('http://jenkins.example.com');
            return sut.lintJenkinsfile('./test/Jenkinsfile').then(res => {
                // to get a crumb header and to lint
                assert(actualUrl.length === 2);

                // to get a crumb header
                assert(actualUrl[0] === 'http://jenkins.example.com/crumbIssuer/api/xml?xpath=concat(//crumbRequestField,":",//crumb)');
                assert(actualMethod[0] === 'GET');
                assert(actualHeaders[0]['Authorization'] === undefined);
                assert(actualBody[0] === undefined);

                // to lint
                assert(actualUrl[1] === 'http://jenkins.example.com/pipeline-model-converter/validate');
                assert(actualMethod[1] === 'POST');
                assert(actualHeaders[1]['Authorization'] === undefined);
                assert(actualHeaders[1]['Jenkins-Crumb'] === 'hogehogefugafuga');
                assert(actualBody[1] instanceof FormData);
            });
        });
    });
});
