var subut = document.querySelector("[type = 'submit']");
var inbox = document.querySelector("[type = 'text']");
var ul = document.querySelector('ul')
var masterlist = {};
var addtodo = function(mssg,id){
  var todoitem = document.createElement("li");
  todoitem.innerText = mssg;
  var rembut = document.createElement('button');
  rembut.innerText = 'Delete Item';
  //add class to left align buttons?
  rembut.addEventListener('click', function(){
    var obj2del = {};
    obj2del[id] = mssg;
    var json = JSON.stringify(obj2del);
    //this will jsut go away and we can use addtodo
    //ul.removeChild(pardiv);
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE','/todos');
    //need to figure out what event below is
    xhr.addEventListener('load',function(){
      var respjson = JSON.parse(this.responseText);
      ul.innerText = '';
      for (var incitem in respjson){
        addtodo(respjson[incitem],incitem);
      };
      console.log(respjson);
    });
    xhr.send(json);
  });
  todoitem.appendChild(rembut);
  ul.appendChild(todoitem);
};
//everything should be coming from server
var inittodos = function(){
  var xhr = new XMLHttpRequest();

  xhr.open('GET','/todos');

  xhr.addEventListener('load',function(){
    var json = this.responseText;
    var petd = JSON.parse(json);
    for (var incitem in petd){
      console.log(incitem);
      //addtodo(petd[incitem]);
      addtodo(petd[incitem],incitem);
    };
  });

  xhr.send();
};
inittodos();

subut.addEventListener('click',function(){
  var xhr = new XMLHttpRequest();
  xhr.open('POST','/todos');
  var json = JSON.stringify(inbox.value);
  xhr.send(json);
  xhr.addEventListener('load',function(){
    if(this.status !== 200){
      alert('Something went wrong.');
    }else{
      //this shouldnt be written twice
      var json = this.responseText;
      var petd = JSON.parse(json);
      ul.innerText = '';
      for (var incitem in petd){
        addtodo(petd[incitem],incitem);
      };
      inbox.value = '';
    }
  });
});

