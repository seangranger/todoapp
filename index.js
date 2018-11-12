var subut = document.querySelector("[type = 'submit']");
var inbox = document.querySelector("[type = 'text']");
var addtodo = function(mssg){
  var todoitem = document.createElement("li");
  todoitem.innerText = mssg;
  document.querySelector('ul').appendChild(todoitem);
};

var inittodos = function(){
  var xhr = new XMLHttpRequest();

  xhr.open('GET','/todos');

  xhr.addEventListener('load',function(){
    var json = this.responseText;
    var petd = JSON.parse(json);
    petd.forEach(addtodo);
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
      addtodo(inbox.value);
      inbox.value = '';
    }
  });
});

