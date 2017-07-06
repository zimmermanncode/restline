/* RESTline> make RESTful Vorpal commands
 *
 * Copyright (C) 2017 Stefan Zimmermann <user@zimmermann.co>
 *
 * MIT License
 */

var request = require('superagent');

function GET(RESTline, action, args, path, query, status) {
    var port = RESTline._port || (RESTline._https && 443 || 80),
        proto = RESTline._https && 'https' || 'http',
        req = request.get(
            proto + '://' + RESTline._host + ':' + port + '/' + path);

    if (query) {
        req.query(query);
    }
    if (RESTline._user) {
        req.auth(RESTline._user, RESEline._password);
    }
    req.accept('application/json')
        .set('Content-Type', 'application/json')
        .end((error, result) => {
            function _handleStatus() {
                var handler = status[result.status];
                if (handler instanceof String || (
                        typeof handler === 'string')) {
                    action.log(handler);
                }
                else {
                    handler.apply(action, [args, result]);
                }
            }

            if (error) {
                if (status && result && result.status in status) {
                    _handleStatus();
                }
                else {
                    var msg = "" + error;
                    if (result) {
                        msg += " (" + result.status + ")";
                    }
                    action.log(msg);
                }
            }
            else if (status && result.status in status) {
                _handleStatus();
            }
            else if (result.status != 200) {
                action.log("Error: No handler for " + result.status);
            }
            else if (result.text) {
                action.log(JSON.stringify(
                    JSON.parse(result.text), null, 4));
            }
        });
}

module.exports = exports = GET;
