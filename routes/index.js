var express = require('express');
var User = require('../models/users');
var Chat = require('../models/chat');
var router = express.Router();

// 必须登录
signinRequired = function(req, res, next) {
  var user = req.session.user;

  if (!user) {
    return res.redirect('/signin');
  }

  next();
}
//必须管理员帐号
adminRequired = function(req, res, next) {
  var user = req.session.user;

  if (user.role < 10) {
    return res.redirect('/signin');
  }

  next();
}

/* GET home page. */
router.get('/', function(req, res) {
	var chats = {};
	var userId;
	if(req.session.user){
		var userId = req.session.user._id;
		Chat.findOne({userId:userId},function(err,chats){
			if(err) console.log(err);
			res.render('index', { 
				title: 'myChat',
				chats: chats
			});
		});
	}else{
		res.render('index', { 
			title: 'myChat'
		});
	}
	
});

/* GET logout page. */
router.get('/logout', function(req, res) {
	delete req.session.user;
	
	res.redirect('/');
});

/* GET signup page. */
router.get('/signup', function(req, res) {
	res.render('register', { 
		title: '注册'
	});
});

/* GET signin page. */
router.get('/signin', function(req, res) {
	res.render('login', { 
		title: '登录'
	});
});


// user register
router.post('/user/signup', function(req, res) {
	var _user = req.body.user;
	var name = _user.name;

	User.findOne({name:name}, function(err, user){
		if(err){
			console.log(err);
		}
		if(user){
			return res.redirect('/signin');
		}else{
			user = new User(_user);	
			user.save(function(err, user){
				if(err) console.log(err);
				res.redirect('/');
			});
		}
	});
});

// user login
router.post('/user/signin', function(req, res) {
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;

	User.findOne({name:name}, function(err, user){
		if(err){
			console.log(err);
		}
		if(!user){
			return res.redirect('/signup');
		}

		user.comparePassword(password, function(err, isMatch) {
	      if (err) {
	        console.log(err)
	      }

	      if (isMatch) {
	      	User.findOne({role:'10'},function(err,admin){
	      		req.session.user = user;
	      		req.session.adminId = admin._id;
	       		return res.redirect('/')
	      	});
	      }
	      else {
	        return res.redirect('/signin')
	      }
	    })

	});
});

/* GET userlist page. */
router.get('/user/list', signinRequired, adminRequired, function(req, res) {

	User.fetch(function(err,users){
		if(err) {
			console.log(err);
		}

		res.render('userlist', { 
			title: 'myChat',
			users: users
		});
	});
});

/* GET admin page. */
router.get('/user/:id', signinRequired, adminRequired, function(req, res) {
	var id = req.params.id;
	Chat.findOne({userId:id},function(err,chats){
		if(err) console.log(err);
		res.render('admin', { 
			title: 'myChat',
			chats: chats
		});
	});
});

module.exports = router;
