var vorpal = require('vorpal')(),
    RESTline = require('restline')(vorpal);

var assert = require('better-assert');

describe('RESTline', () => {
    describe('._vorpal', () => {
        it('should be set to the Vorpal instance from require', () => {
            assert(RESTline._vorpal === vorpal);
        })
    })
    describe('._https', () => {
        it('should be false by default, meaning HTTP is enabled', () => {
            assert(RESTline._https === false);
        })
    })
    describe('._port', () => {
        it('should be undefined by default, meaning auto by protocol',
           () => {
            assert(RESTline._port === undefined);
        })
    })
    describe('._user', () => {
        it('should be undefined by default', () => {
            assert(RESTline._user === undefined);
        })
    })
    describe('._password', () => {
        it('should be undefined by default', () => {
            assert(RESTline._password === undefined);
        })
    })
    describe('.https(host)', () => {
        it('should enable HTTPS, set host, and set port to 443', () => {
            RESTline.https('api.npms.io');
            assert(RESTline._https === true);
            assert(RESTline._host === 'api.npms.io');
            assert(RESTline._port === 443);
        });
    });
    describe('.http(host)', () => {
        it('should enable HTTP again, set host, and set port to 80', () => {
            RESTline.http('registry.npmjs.org');
            assert(RESTline._https === false);
            assert(RESTline._host === 'registry.npmjs.org');
            assert(RESTline._port === 80);
        });
    });
    describe('.https(host, port)', () => {
        it('should enable HTTPS again, set host, and set port', () => {
            RESTline.https('api.npms.io', 4433);
            assert(RESTline._https === true);
            assert(RESTline._host === 'api.npms.io');
            assert(RESTline._port === 4433);
        });
    });
    describe('.http(host, port)', () => {
        it('should enable HTTP again, set host, and set port', () => {
            RESTline.http('registry.npmjs.org', 8080);
            assert(RESTline._https === false);
            assert(RESTline._host === 'registry.npmjs.org');
            assert(RESTline._port === 8080);
        });
    });
    describe('.host(host)', () => {
        it('should set host', () => {
            RESTline.host('api.npms.io');
            assert(RESTline._host === 'api.npms.io');
        });
    });
    describe('.port(port)', () => {
        it('should set port', () => {
            RESTline.port(80);
            assert(RESTline._port === 80);
        });
    });
});
