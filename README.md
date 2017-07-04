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
RESTline.host('registry.npmjs.org');
```

You can also set `RESTline.port(...)`, and `RESTline.user(...)` and
`RESTline.password(...)` for authentication.

Let's create some commands to work with the http://registry.npmjs.org API:

```javascript
RESTline.command("npm vorpal",
                 "Show information for latest version of vorpal package")
    .GET('vorpal/latest');
```

Calling this command will send a GET request via
[superagent](https://www.npmjs.com/package/superagent) to
http://registry.npmjs.org/vorpal/latest and print the JSON response

```
$ npm vorpal
{
  "name": "vorpal",
  "version": "1.12.0",
  "description": "Node's first framework for building immersive CLI apps.",
  ...
}
```

Now we want a command that takes a package name as parameter:

```javascript
RESTline.command("npm package <name>",
                 "Show information for latest version of given package")
    .GET(function (args, GET) {
        GET(args.name + '/latest');
    });
```

```
$ npm package superagent
{
  "name": "superagent",
  "version": "3.5.2",
  "description": "elegant & feature rich browser / node HTTP with a fluent API",
  ...
}
```
