'use strict'

//var http = require('http');
var https = require('https');
var fs = require('fs');

//var serveIndex = require('serve-index');

//var express = require('express');
//var app = express();

//顺序不能换
//app.use(serveIndex('./public'));
//app.use(express.static('./public'));

var options = {
	key  : fs.readFileSync('./mingjuan.xyz.key'),
	cert : fs.readFileSync('./mingjuan.xyz.cer') 
}

var https_server = https.createServer(options, function(req,res){
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('https: hello world\n');
	}).listen(443, '0.0.0.0');
