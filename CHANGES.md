0.0.1
-----

* Require and instantiate `RESTline` with `Vorpal` instance
* Provide `RESTline.https`, `RESTline.http`, `RESTline.host`, `RESTline.port`,
  `RESTline.user`, `RESTline.password`, and `RESTline.command` methods
* `RESTline.command` wraps `vorpal.command` and adds `.GET` and `.POST`
  methods to the resulting vorpal `Command` instance. Both automatically
  create `Command.action` handlers
