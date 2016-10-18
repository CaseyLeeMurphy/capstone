// ----------------------------------- Show that something is happening --------------------------
// ------------------------------------------------------------------------------------------------
console.log('Loading Server');
const WEB = __dirname.replace('server', 'web');
const exec = require('child_process').exec;

// ----------------------------------- Load main modules ------------------------------------------
// ------------------------------------------------------------------------------------------------
var express = require('express');
var fs = require('fs');

// ----------------------------------- Load express middleware modules ----------------------------
// ------------------------------------------------------------------------------------------------
var logger = require('morgan');
var compression = require('compression');
var  bodyParser = require('body-parser');

// ----------------------------------- create express app -----------------------------------------
// ------------------------------------------------------------------------------------------------
var app = express();

// ------------------------------------- Insert Middleware-----------------------------------------
// ------------------------------------------------------------------------------------------------
app.use(logger('dev'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// ----------------------------------- REST end points --------------------------------------------
// ------------------------------------------------------------------------------------------------

// ---------------------------------------- Get ---------------------------------------------------
// ------------------------------------------------------------------------------------------------
app.get("/api/switchon/1", function(req, res) {
	exec('sudo python lights/on.py');
	res.sendStatus(200);
});

app.get("/api/switchoff/1", function(req, res) {
	exec('sudo python lights/off.py');
	res.sendStatus(200);
});

// ----------------------------------- traditional webserver stuff for serving static files -------
// ------------------------------------------------------------------------------------------------
app.use(express.static(WEB));
app.get('*', function(req, res) {
    res.status(404).sendFile(WEB + '/404Error.html');
});

var server = app.listen(3000);

// ----------------------------------- Gracefullly shutdown ---------------------------------------
// ------------------------------------------------------------------------------------------------
function gracefullShutdown() {
    console.log('\nStarting Shutdown');
    server.close(function() {
        console.log('\nShutdown Complete');
    });
}

process.on('SIGTERM', gracefullShutdown);
process.on('SIGINT', gracefullShutdown);

console.log('Now listening');
