var http = require('http');
var server = http.createServer();
var fs = require('fs');
var pages = ['/index.html','/index.js'];
var counter = 4;
var dummydata = {1:'eat',2:'pray',3:'kill for satan'};
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
      //this needs to distinguish between removals and additions
      dummydata[counter] = JSON.parse(body);
      counter += 1;
      var json = JSON.stringify(dummydata);
      res.statusCode = 200;
      res.write(json);
      res.end();
    });
    //below can be folded into above else if?-think that would be good
  }else if (reqpath === '/todos' && req.method === 'DELETE'){
    var body = '';
    req.on('data',function(data){
      body += data;
    });
    req.on('end', function(){
      console.log(body);
      var json = JSON.parse(body);
      for(var key in json){
        console.log('this is dummydata[key] '+dummydata[key]);
        delete dummydata[key];
      }
      var outjson = JSON.stringify(dummydata);
      res.statusCode = 200;
      console.log(outjson);
      res.write(outjson);
      res.end();
      console.log('this is dummydata'+JSON.stringify(dummydata));
    });
  }else{
    res.statusCode = 404;
    res.end();
  }
});
server.listen({host:'127.0.0.1',port:4444});
