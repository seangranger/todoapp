var http = require('http');
var server = http.createServer();
var fs = require('fs');
var pages = ['/index.html','/index.js'];
var dummydata = ['eat','pray','kill for satan'];
server.on('listening',function(){
  console.log('listening...');
});
server.on('request',function(req,res){
  console.log(req.method);
  var reqpath = req.url;
  if (pages.includes(reqpath) && req.method === 'GET'){
    fs.readFile('.'+reqpath,'utf8',function(err,data){
      console.log(err)
      res.write(data);
      res.end();
    });
    //should i have nested if with get and post options within elsif below?
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
      dummydata.push(body);
      console.log(dummydata);
    });
    res.statusCode = 200;
    res.end();
  }else{
    res.statusCode = 404;
    res.end();
  }
});
server.listen({host:'127.0.0.1',port:4444});
