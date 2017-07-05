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

vorpal.find('npm package').remove();

RESTline.command("npm package <name>")
    .option('-v, --verbose', "Be verbose on errors")
    .GET(function (args, GET) {
        GET("v2/package/" + args.name, null, args.options.verbose ? {
            404: "Oops! Package not found!"
        } : null);
    });

vorpal.find('npm package').remove();

RESTline.command("npm package <name>")
    .option('-v, --verbose', "Be verbose on errors")
    .option('-V, --very-verbose', "Be even more verbose on errors")
    .GET(function (args, GET) {
        GET("v2/package/" + args.name, null, args.options['very-verbose'] ? {
            404: function (args, result) {
                this.log("Oops! " + result.status +
                         "! Seems like package '" + args.name +
                         "' was not found!")
            }
        } : args.options.verbose ? {
            404: "Oops! Package not found!"
        } : null);
    });
