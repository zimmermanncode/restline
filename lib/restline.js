/* RESTline> make RESTful Vorpal commands
 *
 * Copyright (C) 2017 Stefan Zimmermann <user@zimmermann.co>
 *
 * MIT License
 */

var Command = require('./command');

function RESTline(vorpal) {
    if (!(this instanceof RESTline)) {
        return new RESTline(vorpal);
    }
    this._vorpal = vorpal;

    this._host = '127.0.0.1';
    this._port = 80;
    return this;
}

module.exports = exports = RESTline;

RESTline.prototype = {
    host: function (host) {
        this._host = host;
        return this;
    },

    port: function (port) {
        this._port = port;
        return this;
    },

    user: function (user) {
        this._user = user;
        return this;
    },

    password: function (password) {
        this._password = password;
        return this;
    },

    command: function (name, description, options) {
        var cmd = this._vorpal.command(name, description, options);
        return Object.assign(cmd, new Command(this), Command.prototype);
    }
};
