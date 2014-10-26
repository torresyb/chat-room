var socketio = require('socket.io');
var Chat = require('../models/chat');
var User = require('../models/users');
var _ = require('underscore');
var io;

exports.listen = function(server){
	io = socketio(server);

	//在线用户
	var onlineUsers = {};
	//当前在线人数
	var onlineCount = 0;
	//聊天房间
	var room = [];

	//用户信息列表(namespace)
	var news = io.of('/user/list').on('connection',function(socket){
		
		socket.on('login',function(data){
			console.log("admin login");
		});
	});

	//私聊区
	io.on('connection', function(socket){

		//监听登录事件
		socket.on('login',function(data){
			socket.name = data.userId;
			//检查在线列表，如果不在里面就加入
	        if(!onlineUsers.hasOwnProperty(data.userId)) {
	            onlineUsers[data.userId] = data.username;
	            //在线人数+1
	            onlineCount++;
	        }

	        //创建房间
	        room[data.userId]=data.userId+data.adminId;

	        //加入房间
			socket.join(room[data.userId]);

	        //向所有客户端广播用户加入
        	io.emit('login', {'onlineUsers':onlineUsers, 'onlineCount':onlineCount});
			console.log(data.username+'加入了聊天室');

		});

		//监听发送信息事件
		socket.on('chat message', function(data){
			// 存储聊天数据（判断是否数据库已存储）
			Chat.findOne({userId:data.userId},function(err,chat){
				if(chat){

					//如果数据库有存储 push方法
					chat.messages.push({message:data.message,name:data.username});

					//存储会话数据
					chat.save(function(err,chats){
						
						if (err) console.log(err);
						
						//每次会话存储对用户信息量+1
						User.update({_id:data.userId},{$inc:{count:1}},{multi: true},function(err){
							if(err) console.log(err);
							io.of('/user/list').emit('change',{id:data.userId});
						});

						//只向指定房间发送信息
						io.in(room[data.userId]).emit('chat message',chats);
						
					});

				}else{

					// 如果数据库没有数据 new Chat 实例化
					var chats = {'userId':data.userId,'messages':[{'message':data.message,'name':data.username}]};
					var chat = new Chat(chats);
					
					//存储会话数据
					chat.save(function(err, chats){
						
						if(err) console.log(err);
						
						//每次会话存储对用户信息量+1
						User.update({_id:data.userId},{$inc:{count:1}},{multi: true},function(err){
							if(err) console.log(err);
							io.of('/user/list').emit('change',{id:data.userId});
						});

						//只向指定房间发送信息
						io.in(room[data.userId]).emit('chat message',chats);
					
					});
				}
			})
			
		});
		
		//退出会话
		socket.on('disconnect', function(data){
			//将退出的用户从在线列表中删除
	        if(onlineUsers.hasOwnProperty(socket.name)) {
	            //退出用户的信息
	            var obj = {userid:socket.name, username:onlineUsers[socket.name]};

	            //删除
	            delete onlineUsers[socket.name];
	            //在线人数-1
	            onlineCount--;

	            //向所有客户端广播用户退出
	            io.emit('logout', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
	            console.log(obj.username+'退出了聊天室');
	        }
		});

	});
};