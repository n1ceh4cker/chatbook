const User = require('../model/User')
const Chatbox = require('../model/Chatbox')

exports.home = (req, res) => {
	const cur_user = req.user
	var friends = []
	var rem_users = []
    var recieved_reqs = []
    var sent_reqs = []
    
    let query1 = User.find({}).where('_id').in(req.user.friends)
    let query2 = User.find({}).where('_id').in(req.user.recieved_reqs)
    let query3 = User.find({}).where('_id').in(req.user.sent_reqs)
    let query4 = User.find({})
	
    query1.exec((err, user)=>{
        friends = user
        query2.exec((err, user)=>{
            recieved_reqs = user
            query3.exec((err, user)=>{
                sent_reqs = user
                query4.exec((err, user) =>{
                    user.forEach(u =>{
                        if(!cur_user.friends.includes(u.id) && !cur_user.recieved_reqs.includes(u.id) && !cur_user.sent_reqs.includes(u.id) && cur_user.id!=u.id){
                            rem_users.push(u)                        
                        }
                    })
                    res.render('index.ejs', { cur_user, friends, recieved_reqs, sent_reqs, rem_users})
                })
            })         
        })
    })
}

exports.send_friend_req = (req, res) =>{
	const chatbox = new Chatbox({
		user_1 : req.user.id,
		user_2 : req.params.id, 
		messages : [],
		active : false
	})
		
    chatbox.save((err) => {
        if(err) console.log(err)
        User.findById(req.params.id, (err, user) =>{
            user.recieved_reqs.push(req.user.id)
            user.save((err) =>{
                if(err) console.log(err)
                req.user.sent_reqs.push(req.params.id)
                req.user.save((err) =>{
                    if(err) console.log(err)
                    res.redirect('/')
                })
            })
        })		
    })
}

exports.accept_friend_req = (req, res) =>{
	Chatbox.findOne({ user_1 : req.params.id, user_2 : req.user.id }, (err, chatbox) =>{
		if(!err){
			chatbox.active = true
			chatbox.save((err) => {
                if(err) console.log(err)
                User.findById(req.params.id, (err, user) =>{
                    if(!err){
                        user.friends.push(req.user.id)
                        user.sent_reqs.pop(req.user.id)
                        user.save((err) =>{
                        if(err) console.log(err)
                        req.user.friends.push(req.params.id)
                        req.user.recieved_reqs.pop(req.params.id)
                        req.user.save((err) =>{
                            if(err) console.log(err)
                            res.redirect('/')
                        })
                    })
                    }
                })
			})		
		}
	})
}