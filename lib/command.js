/* RESTline> make RESTful Vorpal commands
 *
 * Copyright (C) 2017 Stefan Zimmermann <user@zimmermann.co>
 *
 * MIT License
 */

var GET = require('./get'),
    POST = require('./post');

function Command(RESTline) {
    this._RESTline = RESTline;
    return this;
}

module.exports = exports = Command;

Command.prototype = {
    GET: function (handler, query, status) {
        var RESTline = this._RESTline;

        if (handler instanceof String || typeof handler === 'string') {
            // ==> handler is directly the GET path
            return this.action(function (args, callback) {
                GET(RESTline, this, args, handler, query, status);
                callback();
            });
        }
        // ==> handler is a function for processing volpal command args
        // before calling actual GET
        return this.action(function (args, callback) {
            var action = this;
            handler.apply(this, [
                args, /*GET:*/ (path, query, status) => {
                    GET(RESTline, action, args, path, query, status);
                }
            ]);
            callback();
        });
    },

    POST: function (handler, query, data, status) {
        var RESTline = this._RESTline;

        if (handler instanceof String || typeof handler === 'string') {
            // ==> handler is directly the POST path
            return this.action(function (args, callback) {
                POST(RESTline, this, args, handler, query, data, status);
                callback();
            });
        }
        // ==> handler is a function for processing volpal command args
        // before calling actual POST
        return this.action(function (args, callback) {
            var action = this;
            handler.apply(this, [
                args, /*POST:*/ (path, query, data, status) => {
                    POST(RESTline, action, args, path, query, data, status);
                }
            ]);
            callback();
        });
    },
};
