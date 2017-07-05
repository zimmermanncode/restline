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
`RESTline` needs a host to send REST requests to:

```javascript
RESTline.host('api.npms.io');
```

You can also set `RESTline.port(number)`, and `RESTline.user('...')` and
`RESTline.password('...')` for authentication.

Let's create some commands to work with the http://api.npms.io API:

```javascript
RESTline.command("npm vorpal",
                 "Show information for latest version of vorpal package")
    .GET("v2/package/vorpal");
```

`RESTline.command(...).GET(handler [, query [, status]])` will automatically
create a [vorpal.command(...)](
  https://github.com/dthree/vorpal/wiki/api-%7C-vorpal.command)
and a [vorpal.command(...).action(function ...)](
  https://github.com/dthree/vorpal/wiki/api-%7C-vorpal.command#commandactionfunction).
Since the `handler` is just a `string`, calling the command will send a GET
request via [superagent](https://www.npmjs.com/package/superagent) to
http://api.npms.io/v2/package/vorpal and print the JSON response:

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
is called with the vorpal command `args` and an internal RESTline
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

You might need query variables at the end of your URL:

```javascript
RESTline.command("npm search <name>")
    .GET(function (args, GET) {
        GET("v2/search", {q: args.name});
    });
```

Calling the command with `vorpal` as `<name>` argument will send a GET request
to `http://api.npms.io/v2/search?q=vorpal`:

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
Let's redefine `npm package` with a verbose flag:

```javascript
vorpal.find('npm package').remove();

RESTline.command("npm package <name>")
    .option('-v, --verbose', "Be verbose on errors")
    .GET(function (args, GET) {
        GET("v2/package/" + args.name, null, args.options.verbose ? {
            404: "Oops! Package not found!"
        } : null);
    });
```

```
$ npm package -v non-existent
Oops! Package not found!
```

Instead of a simple string also a custom `status` handler function can be
used, producing even more verbose output, whereby the status handler gets
called with `this` of `vorpal.command("...").action(function ...)` and `args`
and the [superagent](https://www.npmjs.com/package/superagent) REST `result`
as arguments:

```javascript
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
        });
    });
```

```
$ npm package -V non-existent
Oops! 404! Seems like package 'non-existent' was not found!
```
