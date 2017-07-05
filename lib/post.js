/* RESTline> make RESTful Vorpal commands
 *
 * Copyright (C) 2017 Stefan Zimmermann <user@zimmermann.co>
 *
 * MIT License
 */

var request = require('superagent');

function POST(RESTline, action, args, path, query, data, status) {
    var req = request.get(
        'http://' + RESTline._host + ':' + RESTline._port + '/' + path);

    if (query) {
        req.query(query);
    }
    if (RESTline._user) {
        req.auth(RESTline._user, RESEline._password);
    }
    req.accept('application/json')
        .set('Content-Type', 'application/json')
        .send(data)
        .end(function (error, result) {
            function handleStatus() {
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
                    handleStatus();
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
                handleStatus();
            }
            else if (result.status != 200) {
                action.log("Error: No handler for " + result.status);
            }
            else if (result.text) {
                action.log(JSON.stringify(
                    JSON.parse(result.text), null, 2));
            }
        });
}

module.exports = exports = POST;
