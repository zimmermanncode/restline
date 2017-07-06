var vorpal = require('vorpal')(),
    RESTline = require('./lib/RESTline')(vorpal);

vorpal.use(require('vorpal-less'));

vorpal.show();

RESTline.https('api.npms.io');

RESTline.command("npm vorpal",
                 "Show information for latest release of vorpal package")
    .GET("v2/package/vorpal");

RESTline.command("npm package <name>",
                 "Show information for latest release of given package")
    .GET(function (args, GET) {
        GET("v2/package/" + args.name);
    });

RESTline.command("npm search <string>",
                 "Search for packages containing given string")
    .GET(function (args, GET) {
        GET("v2/search", {q: args.string});
    });

vorpal.find('npm package').remove();

RESTline.command("npm package <name>",
                 "Show information for latest release of given package")
    .option('-v, --verbose', "Be verbose on errors")
    .option('-V, --very-verbose', "Be even more verbose on errors")
    .GET(function (args, GET) {
        GET("v2/package/" + args.name, null,
            args.options['very-verbose'] ? {
                404: function (args, result) {
                    this.log("Oops! " + result.status +
                             "! Seems like package '" + args.name +
                             "' was not found!")
                }
            } : args.options.verbose ? {
                404: "Oops! Package not found!"
            } : null);
    });

RESTline.command("npm mget <names...>")
    .POST(function (args, POST) {
        POST("v2/package/mget", null, args.names);
    });
