var http = require('http');
var querystring = require('querystring');
var server = http.createServer();
var fs = require('fs');
var pages = ['/login.html','/app.js','/index.html','/index.js'];
var dummydata = {1:'eat',2:'pray',3:'kill for satan'};
var dummyusers = {'user1':'password1'};
server.on('listening',function(){
  console.log('listening...');
});

var servepage = function(req,res){
  fs.readFile('.'+req.url,'utf8',function(err,data){
    if(err) console.log(err);
    res.write(data);
    res.end();
  });
};

var servetodos = function(res){
  res.write(JSON.stringify(dummydata));
  res.end();
};

var receivetodo = function(req,res){
  console.log('post recieved');
  var body = '';
  req.on('data', function(data){
    body += data;
  });
  req.on('end', function(){
    var mssg = JSON.parse(body);
    //is this really a good way to do it?
    dummydata[Object.keys(mssg)[0]] = Object.values(mssg)[0];
    res.statusCode = 200;
    res.end();
  });
};

var removetodo = function(req,res){
  delete dummydata[req.url.substring(7)];
  //code below could be 204 if you want to be more specific
  res.statusCode = 200;
  res.end();
};

var login = function(req,res){
  console.log('ENTERING LOGIN FUNC');
  var body = '';
  req.on('data', function(data){
    body += data;
  });
  req.on('end', function(){
    var unpw = querystring.parse(body);
    if(dummyusers[unpw['un']] !== undefined && dummyusers[unpw['un']] === unpw['pw']){
      console.log('LOGIN SUCCESS');
      res.setHeader('Set-Cookie', ['loginstatus=loggedin']);
      res.setHeader('Location','/index.html');
    }else{
      console.log('LOGIN FAILED');
      res.setHeader('Location','/login.html');
    }
    res.statusCode = 301;
    res.end();
    //401 is for failed login
  });
};

var loggedinprivs = function(req,res){
  var reqpath = req.url;
  if (pages.includes(req.url) && req.method === 'GET'){
    servepage(req,res);
    //should i have nested if with get and post options within else if below?
  }else if (reqpath === '/todos' && req.method === 'GET'){
    servetodos(res);
  }else if(reqpath === '/todos' && req.method === 'POST'){
    receivetodo(req,res);
    //below can be folded into above else if?-think that would be good
  }else if (reqpath.substring(0,7) === '/todos/' && req.method === 'DELETE'){
    removetodo(req,res);
  }else if(reqpath === '/sublogin' && req.method === 'POST'){
    login(req,res);
  } else{
    res.statusCode = 404;
    res.end();
  }
};

server.on('request',function(req,res){
  console.log(req.method,req.url);
  console.log(req.headers);
  var cookie = req.headers['cookie'];
  if(cookie !== undefined && cookie.substring(12) === 'loggedin'){
    console.log('Here is substring: '+cookie.substring(12));
    loggedinprivs(req,res);
  } else if (req.url === '/sublogin' && req.method === 'POST'){
    login(req,res);
    //can below be combined ot just serve /login.html or should they be seperate to send seperate status codes?
  } else if (req.url !== '/login.html'){
    res.setHeader('Location','/login.html');
    res.statusCode = 301;
    res.end();
  } else if (req.url === '/login.html'){
    servepage(req,res);
  }
});

server.listen({host:'127.0.0.1',port:4444});
