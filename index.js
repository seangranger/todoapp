var subut = document.querySelector("[type = 'submit']");
var inbox = document.querySelector("[type = 'text']");
var ul = document.querySelector('ul')
var crypto = require('crypto');
var html = require('nanohtml');
var todolist = {};
var rendertodos = function(){
  ul.innerText = '';
  for (var uids in todolist){
    addtodo(todolist[uids],uids);
  }
};

var addtodo = function(mssg,id){
  //add class to left align buttons?
  //run through namespaces/closures in this case
  var rembut = function(){
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE','/todos/'+id);
    xhr.addEventListener('load',function(){
      if(this.status !== 200){
        alert('Removal failed. Try again.');
      }else{
        delete todolist[id];
        rendertodos();
      };
    });
    xhr.send();
  };
  var todoitem = html`
    <li>${mssg}
      <button onclick =${rembut}>Delete Item
      </button>
    </li>
  `;
  ul.appendChild(todoitem);
};

var inittodos = function(){
  var xhr = new XMLHttpRequest();
  xhr.open('GET','/todos');
  xhr.addEventListener('load',function(){
    todolist = JSON.parse(this.responseText);
    rendertodos();
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
      todolist[uid] = inbox.value;
      rendertodos();
      inbox.value = '';
    }
  });
  xhr.send(json);
});

