var subut = document.querySelector("[type = 'submit']");
var inbox = document.querySelector("[type = 'text']");
subut.addEventListener('click',function(){
  var xhr = new XML
  var todoitem = document.createElement("li");
  todoitem.innerText = inbox.value;
  document.querySelector('ul').appendChild(todoitem);
});

