# RESTline> make RESTful Vorpal commands


```javascript
var vorpal = require('vorpal')(),
    RESTline = require('restline')(vorpal);

vorpal.show();
```

In parallel to [vorpal.command(command [, description])](
  https://github.com/dthree/vorpal/wiki/api-%7C-vorpal.command) you can now
easily create commands that do REST operations in the background via
`RESTline.command(...)`, which takes the same arguments. But first,
`RESTline` needs a host to send REST requests to. You can either define a
`.https(host [, port])` or a `.http(host [,port])`.

```javascript
RESTline.https('api.npms.io');
```

The default `port` for `.https` is `443`, for `.http` it defaults to `80`.

You can also directly set `RESTline.host('...')` and `RESTline.port(...)`
without changing the protocol, which defaults to HTTP.

For authentication there is `RESTline.user('...')` and
`RESTline.password('...')`.

Let's create some commands to work with the https://api.npms.io API:

```javascript
RESTline.command("npm vorpal",
                 "Show information for latest release of vorpal package")
    .GET("v2/package/vorpal");
```

`RESTline.command(...).GET(handler [, query [, status]])` will automatically
create a [vorpal.command(...)](
  https://github.com/dthree/vorpal/wiki/api-%7C-vorpal.command)
and a [vorpal.command(...).action(function ...)](
  https://github.com/dthree/vorpal/wiki/api-%7C-vorpal.command#commandactionfunction).
Since the `handler` is just a `string`, calling the command will send a GET
request via [superagent](https://www.npmjs.com/package/superagent) to
https://api.npms.io/v2/package/vorpal and print the JSON response:

```
$ npm vorpal
{
  ...
  "collected": {
    "metadata": {
      "name": "vorpal",
      "scope": "unscoped",
      "version": "1.12.0",
      "description": "Node's first framework for building immersive CLI apps.",
      ...
      },
    ...
  },
  ...
}
```

Now we want a command that takes a package name as parameter. For that purpose
you can also pass a `handler` function to `RESTline.command(...).GET`, which
is called with `this` of `vorpal.command("...").action(function ...)`, and the
vorpal command `args` and an internal RESTline
`GET(path [, query [, status]])` function, which does the actual REST request:

```javascript
RESTline.command("npm package <name>",
                 "Show information for latest version of given package")
    .GET(function (args, GET) {
        GET("v2/package/" + args.name);
    });
```

```
$ npm package superagent
{
  ...
  "collected": {
    "metadata": {
      "name": "superagent",
      "scope": "unscoped",
      "version": "3.5.2",
      "description": "elegant & feature rich browser / node HTTP with a fluent API",
      ...
      },
    ...     
  },
  ...
}
```

You might need `query` variables at the end of your URL:

```javascript
RESTline.command("npm search <string>")
    .GET(function (args, GET) {
        GET("v2/search", {q: args.string});
    });
```

Calling the command with `vorpal` as `<string>` argument will send a GET
request to `https://api.npms.io/v2/search?q=vorpal`:

```
$ npm search vorpal
{
    "total": 56,
    "results": [
        {
            "package": {
                "name": "vorpal",
                "scope": "unscoped",
                "version": "1.12.0",
                "description": "Node's first framework for building immersive CLI apps.",
                ...
            },
            ...
        },
        ...
    ]
}
```

The REST response status is not always fine:

```
$ npm package non-existent
Error: Not Found (404)
```

You can accept that standard error output or define custom `status` handlers.
They can be either simple message strings or handler functions, that will be
called with `this` of `vorpal.command("...").action(function ...)` and `args`
and the [superagent](https://www.npmjs.com/package/superagent) REST `result`
as arguments. Let's redefine `npm package` with two verbosity flag:

```javascript
vorpal.find('npm package').remove();

RESTline.command("npm package <name>",
                 "Show information for latest version of given package")
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
```

```
$ npm package -v non-existent
Oops! Package not found!
```

```
$ npm package -V non-existent
Oops! 404! Seems like package 'non-existent' was not found!
```

Enough of `.GET`! Let's do a
`RESTline.command(...).POST(handler [, query [, data [, status]]])`.
It takes an additional `data` argument between `query` and `status`, which
defines the POST data to be sent. If `handler` is a function, it will also be
called with `this` of `vorpal.command("...").action(function ...)`, and the
vorpal command `args` and in this case an internal `POST` function that takes
the same arguments as `RESTline.command(...).POST`:

```javascript
RESTline.command("npm mget <names...>")
    .POST(function (args, POST) {
        POST("v2/package/mget", null, args.names);
    });
```

```
$ npm mget vorpal superagent
{                                                                                        
    "vorpal": {
        ...
        "collected": {
            "metadata": {
                "name": "vorpal",
                "scope": "unscoped",
                "version": "1.12.0",
                "description": "Node's first framework for building immersive CLI apps.",
                ...
            },
            ...
        },
    ...
    },
    "superagent": {
        ...
        "collected": {
            "metadata": {
                "name": "superagent",
                "scope": "unscoped",
                "version": "3.5.2",
                "description": "elegant & feature rich browser / node HTTP with a fluent API",
                ...
            },
            ...
        },
    ...
    }
}
```
