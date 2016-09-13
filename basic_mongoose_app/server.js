var express = require("express");
var path = require("path");
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./static")));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// connecting to the mongodb database
mongoose.connect('mongodb://localhost/basic_mongoose'); 

// Build schema that will use to model users
var UserSchema = new mongoose.Schema({
 name: {type: String},
 age: {type: Number}
},{timestamps:true})

mongoose.model('User', UserSchema); // We are setting this Schema in our Models as 'User'
var User = mongoose.model('User'); //  We are retreving this schema from our models named 'User'

app.get('/', function(req, res) { // we want to get all of the users from the db and render them on to the index page
		User.find({}, function(err, users) {
			if (err){
				res.json(err)
				console.log(err)
			}
			else{
				res.render("index", {title: 'Survey Form', users: users});
			}
		})
})


// add user request
app.post('/users', function(req,res){
	console.log("POST DATA", req.body);
	// create a new user  with name and age from the req.bodyparser
	var user = new User({name: req.body.name, age: req.body.age});
	  // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
	  user.save(function(err) {
	    // if there is an error console.log that something went wrong!
	    if(err) {
	      console.log('something went wrong');
	    } 
	    else { // else console.log that we did well and then redirect to the root route
	      console.log('successfully added a user!');
	      res.redirect('/');
	    }
	})
})



app.listen(8000, function() {
 console.log("listening on port 8000");
})

// Finding users based on requirement : Line 24 becomes as
// User.find({name: "saiteju"}, function(err, users) {

// When we want to add new user directly Line 36-51 become as 
// var userInstance = new User()
// userInstance.name = 'Andriana'
// userInstance.age = 29
// userInstance.save(function(err){
// 		if(err) {
// 	      console.log('something went wrong');
// 	    } 
// 	    else { // else console.log that we did well and then redirect to the root route
// 	      console.log('successfully added a user!');
// 	      res.redirect('/');
// 	    }
// 	})

// Remooving users based on requirement : Line 24 becomes as
// User.remove({name: 'Andriana'}, function(err, users) {


//  To update any record line 23 - 33 becomes as
// app.get('/', function(req, res) { 
// User.update({name:'saiteju'}, {name:'Saiteju'}, function(err){
//  	if (err){
// 			res.json(err)
// 			console.log(err)
// 			}
// 	else{
// 		res.render("index", {title: 'Survey Form', users: users});
// 		}
// 	})
// })



