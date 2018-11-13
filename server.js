var http = require('http');
var server = http.createServer();
var fs = require('fs');
var pages = ['/app.js','/index.html','/index.js'];
var dummydata = {1:'eat',2:'pray',3:'kill for satan'};
server.on('listening',function(){
  console.log('listening...');
});
server.on('request',function(req,res){
  var reqpath = req.url;
  if (pages.includes(reqpath) && req.method === 'GET'){
    fs.readFile('.'+reqpath,'utf8',function(err,data){
      console.log(err)
      res.write(data);
      res.end();
    });
    //should i have nested if with get and post options within else if below?
  }else if (reqpath === '/todos' && req.method === 'GET'){
    var json = JSON.stringify(dummydata);
    res.write(json);
    res.end();
  }else if(reqpath === '/todos' && req.method === 'POST'){
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
    //below can be folded into above else if?-think that would be good
  }else if (reqpath.substring(0,7) === '/todos/' && req.method === 'DELETE'){
    req.on('end', function(){
      delete dummydata[reqpath.substring(7)];
    });
    res.statusCode = 200;
    res.end();
  }else{
    res.statusCode = 404;
    res.end();
  }
});
server.listen({host:'127.0.0.1',port:4444});
