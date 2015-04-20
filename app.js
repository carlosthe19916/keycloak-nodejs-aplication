var Keycloak = require('connect-keycloak');

var express = require('express');
var session = require('express-session');

var app = express();

// Allow passing in a port from the command-line.
var p = 3000;
if ( process.argv.length >= 3 ) {
    p = Number( process.argv[2] );
}
app.set('port', p );

//
var memoryStore = new session.MemoryStore();

app.use( session({
    secret: '2fafb62e-3437-4bc3-b1cb-42f591d85c8f',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
} ));

var keycloak = new Keycloak({
    store: memoryStore
});

//middleware
app.use( keycloak.middleware( {
    logout: '/logout',
    admin: '/'
} ));


// A normal un-protected public URL.
app.get( '/', function(req,resp) {
    resp.send(
            'hello this is a UNPROTECT page' + '<br>' +
                '* Click here for go to' + '<a href="/index.html">PROTECT page</a>' + '<br>' +
                '* Click here to logout' + '<a href="/logout">Logout</a>' + '<br>');
} );

app.get( '/:page', keycloak.protect(), function(req,resp) {
    resp.send( 'Page: ' + req.params.page + '<br><a href="/logout">logout</a>');
} );

var server = app.listen(app.settings.port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
