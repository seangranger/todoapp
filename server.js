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
  }else if (reqpath === '/todos' && req.method === 'GET'){
    var json = JSON.stringify(dummydata);
    res.write(json);
    res.end();
  }
});
server.listen({host:'127.0.0.1',port:4444});
