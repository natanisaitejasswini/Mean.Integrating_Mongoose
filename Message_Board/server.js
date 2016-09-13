// import required modules
var express = require("express");
var path = require("path");
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// Setup App
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./static")));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// setup Mongoose Connection
var connection = mongoose.connect('mongodb://localhost/message_dashboard'); // Db name

// Creating Schema
var MessageSchema = new mongoose.Schema({
	name: {type: String, required: true, minlength: 4},
	message: {type: String, required: true, minlength: 4, maxlength: 255},
	_comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
	},{timestamps:true})

// to register Schema we need two things: Key and Schema name we have created above
mongoose.model('Message', MessageSchema); // collection name: messages

var CommentSchema = new mongoose.Schema({
	name: {type: String, required: true, minlength: 4},
	comment: {type: String, required: true, minlength: 4, maxlength: 255},
	_message: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
	},{timestamps:true})

mongoose.model('Comment', CommentSchema);  // collection name: comments

// Use Schema by assigning to a varaiable. This variable gives a Schema that we store
var Message = mongoose.model('Message'); 
var Comment = mongoose.model('Comment');

///////////////ROUTES////////////////
app.get('/', function(req, res) { 
	Message.find({}).populate('_comments').exec(function(err, messages) {
		console.log(messages)
	if (err){
				res.json(err)
				console.log(err)
			}
	else{
		res.render("index", {title: 'Messaging App', messages: messages});
	}
	
	})	
})

app.post('/create_message', function(req,res){
	console.log("POST DATA", req.body);
	var message = new Message({name: req.body.name, message: req.body.message});
	  message.save(function(err) {
	    if(err) {
	    	var errors_messages =[]
				for(var i in err.errors ){
					if(err.errors[i].message){
						console.log(err.errors[i].message)
					}
					errors_messages.push(err.errors[i].message)
				}
	      console.log('something went wrong');
	      res.render('index', {title: 'you have errors!', errors: errors_messages})
	    } 
	    else { 
	      console.log('successfully added a post!');
	      res.redirect('/');
	    }
	})
})

app.post('/create_comment/:message_id', function(req,res){
	Message.findOne({_id: req.params.message_id}, function(err,messages){
		if(err){
			res.json(err)
		}
		else{
			// Data from the form on the front end
			var new_comment = new Comment({name: req.body.name, comment: req.body.comment, 
				_message: req.params.message_id});
			// setting the reference
			new_comment._message = req.params.message_id;
			// update the message with comment which is nothing but saving both tables
			new_comment.save(function(err){
				if(err){
						var errors_comments =[]
						for(var i in err.errors ){
							if(err.errors[i].message){
								console.log(err.errors[i].message)
							}
							errors_comments.push(err.errors[i].message)
						}
					res.render('index', {title: 'you have errors!', errors: errors_comments})
					console.log('Something went wrong in posting a comment')
					// res.json(err)
				}
				else{
					// update the message with comment.id
					// its not message its messages that we are passing in function
					messages._comments.push(new_comment);
					messages.save(function(err){
						if(err) { 
								console.log('Error during message saving with comments'); 
								} 
                       	else { 
                       		console.log('Messages are saved with comments')
                       		res.redirect('/'); 
                       	}
					})
				}
			})
		}
	})
})

app.listen(8000, function() {
 console.log("listening on port 8000");
})