# RESTline> make RESTful Vorpal commands


```javascript
var vorpal = require('vorpal')(),
    RESTline = require('restline')(vorpal);

vorpal.show();
```

In parallel to [vorpal.command(...)](
  https://github.com/dthree/vorpal/wiki/api-%7C-vorpal.command) you can now
easily create commands that do REST operations in the background via
`RESTline.command(...)`. But first, `RESTline` needs a host to send REST
requests to:

```javascript
RESTline.host('api.npms.io');
```

You can also set `RESTline.port(...)`, and `RESTline.user(...)` and
`RESTline.password(...)` for authentication.

Let's create some commands to work with the http://api.npms.io API:

```javascript
RESTline.command("npm vorpal",
                 "Show information for latest version of vorpal package")
    .GET("v2/package/vorpal");
```

Calling this command will send a GET request via
[superagent](https://www.npmjs.com/package/superagent) to
http://api.npms.io/v2/package/vorpal and print the JSON response

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

Now we want a command that takes a package name as parameter:

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

You can accept that standard error output or define custom status handlers.
Let's define a verbose `npm package -v` variant:

```javascript
RESTline.command("npm package -v <name>")
    .GET(function (args, GET) {
        GET("v2/package/" + args.name, null, {
            404: "Oops! Package not found!"
        });
    });
```

```
$ npm package -v non-existent
Oops! Package not found!
```

Instead of a simple string also a custom status handler function can be used,
producing even more verbose output:

```javascript
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
```

```
$ npm package -vv non-existent
Oops! 404! Seems like package 'non-existent' was not found!
```
