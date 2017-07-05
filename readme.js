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
