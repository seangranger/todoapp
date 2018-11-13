var subut = document.querySelector("[type = 'submit']");
var inbox = document.querySelector("[type = 'text']");
var ul = document.querySelector('ul')
var crypto = require('crypto');
var todolist = {};
var addtodo = function(mssg,id){
  var todoitem = document.createElement("li");
  todoitem.innerText = mssg;
  var rembut = document.createElement('button');
  rembut.innerText = 'Delete Item';
  //add class to left align buttons?
  //run through namespaces/closures in this case
  rembut.addEventListener('click', function(){
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE','/todos/'+id);
    xhr.addEventListener('load',function(){
      if(this.status !== 200){
        alert('Removal failed. Try again.');
      }else{
        ul.innerText = '';
        delete todolist[id];
        for (var uids in todolist){
          addtodo(todolist[uids],uids);
        }
      };
    });
    xhr.send();
  });
  todoitem.appendChild(rembut);
  ul.appendChild(todoitem);
};

var inittodos = function(){
  var xhr = new XMLHttpRequest();
  xhr.open('GET','/todos');
  xhr.addEventListener('load',function(){
    var petd = JSON.parse(this.responseText);
    for (var incitem in petd){
      todolist[incitem] = petd[incitem];
      addtodo(petd[incitem],incitem);
    };
  });
  xhr.send();
};
inittodos();

subut.addEventListener('click',function(){
  var xhr = new XMLHttpRequest();
  xhr.open('POST','/todos');
  var uid = crypto.randomBytes(7).toString('hex');
  var obj2send = {};
  obj2send[uid] = inbox.value;
  var json = JSON.stringify(obj2send);
  xhr.addEventListener('load',function(){
    if(this.status !== 200){
      alert('Something went wrong.');
    }else{
      ul.innerText = '';
      todolist[uid] = inbox.value;
      for (var uids in todolist){
        addtodo(todolist[uids],uids);
      }
      inbox.value = '';
    }
  });
  xhr.send(json);
});

