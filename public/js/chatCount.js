var socket = io("http://localhost:3000/user/list");
$(function(){
	socket.on("connect",function(){
		socket.emit("login",{user:'admin'});

		socket.on('change',function(data){
			var tr = $("tr.item-"+data.id);
			var td = tr.find("td.count");
			var num = td.text();
			var end = parseInt(num)+1;
			td.text(end);
		});
	})
});
