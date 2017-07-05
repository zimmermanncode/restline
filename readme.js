var vorpal = require('vorpal')(),
    RESTline = require('./lib/RESTline')(vorpal);

vorpal.use(require('vorpal-less'));

vorpal.show();

RESTline.host('api.npms.io');

RESTline.command("npm vorpal")
    .GET("v2/package/vorpal");

RESTline.command("npm package <name>")
    .GET(function (args, GET) {
        GET("v2/package/" + args.name);
    });

RESTline.command("npm search <name>")
    .GET(function (args, GET) {
        GET("v2/search", {q: args.name});
    });

RESTline.command("npm package -v <name>")
    .GET(function (args, GET) {
        GET("v2/package/" + args.name, null, {
            404: "Oops! Package not found!"
        });
    });

RESTline.command("npm package -vv <name>")
    .GET(function (args, GET) {
        GET("v2/package/" + args.name, null, {
            404: function (args, result) {
                this.log("Oops! " + result.status +
                         "! Seems like package '" + args.name +
                         "' was not found!")
            }
        });
    });
