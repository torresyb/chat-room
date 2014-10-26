var socket = io();
$(function(){
	//判断用户是否登录
	if($("#userName").val()!=undefined){
		var username = $('#userName').val();
		var userId = $('#userId').val();
		var adminId = $('#adminId').val();
		socket.emit("login",{'userId':userId,'username':username,'adminId':adminId});
	}

	//监听用户登录服务端返回数据
	socket.on('logout',function(data){
		console.log(data);
	});

	$('a.chatSend').click(function(){
		var username = $('#userName').val();
		var message = $('#textInput').val();
		var userId = $('#userId').val();
		var adminId = $('#adminId').val();
		if(username!="" && username){
			if(message!=""){
				
				socket.emit('chat message', {'userId':userId,'adminId':adminId,'username':username,'message':message});
				
				$('#textInput').val('');
				return false;
			
			}else{
				
				alert("请输入内容！");
				return false;
			}
		}else{
			
			$("#login").trigger('click');
		}
	});

	//监听用户登录服务端返回数据
	socket.on('login',function(data){
		console.log(data);
	});

	//监听 chat message
	socket.on('chat message',function(data){
		var chat = data.messages[data.messages.length-1];
		var _class = chat.name==$('#userName').val()?"me":"you";
		var str = '<li class="'+_class+'">'+
              		'<div class="chat_avata"><a target="_blank" href="/user/'+data.userId+'"><img height="40px" width="40px" class="img_border_one" src="http://img.mukewang.com/user/53ddf68800017d2401800180-80-80.jpg"></a></div>'+
              		'<div class="a_msg_info" id="'+data._id+'">'+
                		'<pre>'+chat.name+': '+chat.message+'</pre>'+
                		'<i class="arrow_left_b"></i>'+
              		'</div>'+
              		'<small class="time">'+chat.createAt+'</small>'+
            	  '</li>';
        $('.userchatUl').append(str);
	})
});
