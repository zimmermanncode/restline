var vorpal = require('vorpal')(),
    RESTline = require('./RESTline')(vorpal);

vorpal.show();

RESTline.host('api.npms.io');

RESTline.command("npm vorpal")
    .GET("v2/package/vorpal");

RESTline.command("npm package <name>")
    .GET(function (args, GET) {
        GET("v2/package/" + args.name);
    });
