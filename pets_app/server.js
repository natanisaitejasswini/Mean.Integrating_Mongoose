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

var connection = mongoose.connect('mongodb://localhost/pets_dashboard'); // Db name

var PetSchema = new mongoose.Schema({
	name: {type: String},
	description: {type: String},
	age: {type: Number},
	},{timestamps:true})

mongoose.model('Pet', PetSchema); 
var Pet = mongoose.model('Pet'); 

///////////////ROUTES////////////////
//  GET '/' Displaying all animals
app.get('/', function(req, res) { 
	Pet.find({}, function(err, pets) { // To sort quotes in desc by createdAt change vote: createdAt
		if (err){
					res.json(err)
					console.log(err)
				}
		else{
				res.render("index", {title: 'pet App ', pets: pets});
		}
	
	})
})


// GET '/new' Displays a form for making a new animal
app.get('/new', function(req, res) { 
			res.render("new");
})


// POST '/' should be the action attribute for the form in the above route
app.post('/',function(req,res){
	console.log("POST DATA", req.body);
	var pet = new Pet({name: req.body.name, description: req.body.description, age: req.body.age});
	  pet.save(function(err) {
	    if(err) {
	      console.log('something went wrong');
	    } 
	    else { 
	      console.log('successfully added a quote!');
	      res.redirect('/');
	    }
	})
})

// GET '/:id/edit' Should show a form to Edit an existing animal
app.get('/:id/edit', function(req, res) { 
	Pet.findOne({_id:req.params.id}, function(err,pets){
	 	if (err){
				res.json(err)
				console.log(err)
				}
		else{
			res.render("edit", {title: 'Pet App', pets:pets});
			}
	})
})

// GET '/:id' Displaying one animal based on id
app.get('/:id', function(req, res) { 
	Pet.findOne({_id: req.params.id}, function(err, pets) {
			if (err){
				res.json(err)
				console.log(err)
			}
			else{
				res.render("show", {title: 'Pet Form', pets: pets});
			}
		})
})

// POST '/:id' should be the action attribute for the form in the above attribute
app.post('/:id',function(req,res){
	Pet.update({_id:req.params.id}, { name: req.body.name, description: req.body.description, age: req.body.age}, function(err){
		if(err){
			res.json(err)
		}
		else{
			res.redirect('/')
		}
	})
})

// POST '/:id/destroy' should delete the animal from the database by ID
app.post('/:id/destroy', function(req, res) { 
		Pet.remove({_id:req.params.id}, function(err) {
			if (err){
				res.json(err)
				console.log(err)
			}
			else{
				res.redirect('/')
			}
		})
})

app.listen(8000, function() {
 console.log("listening on port 8000");
})

