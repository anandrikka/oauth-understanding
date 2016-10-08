var express = require('express');
var https= require('https');
var http= require('http');
var queryString = require('querystring');
var request =  require('request');

var app = express();

//This is for end-point url provided by instagram for both autherization and authentication
var site = "https://api.instagram.com";

var config = {};
config.client_id="0bfc9a86546945b1b5c8e4b115e70c17";
config.client_secret = 'ed27c9ffb91f45c681406398097dd85b';
config.callbackURL = 'http://localhost/authenticate/callback';
config.response_type = 'code';
config.authorizeUrl = '/oauth/authorize';
config.authorizeTokenUrl = '/oauth/token';

var authoriationUrl = site + config.authorizeUrl + '?response_type=' + 
	config.response_type + '&client_id=' + config.client_id +  '&state=xyz&redirect_uri=' + config.callbackURL;

app.get('/', function(req, res){
	res.send('<a href="/auth">Login with Instagram</a>')
});

app.get('/auth', function(req, res){
	res.redirect(authoriationUrl);
})

app.get('/authenticate/callback', function(req, res){
	var code = req.query.code;
	var postbody = {
		client_id:config.client_id,
		client_secret:config.client_secret,
		grant_type:'authorization_code',
		redirect_uri:'http://localhost/authenticate/callback',
		code:code
	}

	var formData = queryString.stringify(postbody);

	request({
	    headers: {
	      'Content-Type': 'application/x-www-form-urlencoded'
	    },
	    uri: 'https://api.instagram.com/oauth/access_token',
	    body: formData,
	    method: 'POST'
	  }, function (err, res1, body) {
	  	res.send(body+' '+err+' ' +res);
	  });
});

console.log('app is listening on port: 80')
app.listen(80);