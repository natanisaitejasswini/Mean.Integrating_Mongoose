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
var connection = mongoose.connect('mongodb://localhost/quotes_dashboard'); // Db name

// Creating Schema
var QuoteSchema = new mongoose.Schema({
	name: {type: String},
	quote: {type: String},
	vote: {type: Number},
	},{timestamps:true})

// to register Schema we need two things: Key and Schema name we have created above
mongoose.model('Quote', QuoteSchema); // collection name its lowercases it and plurals it

// Use Schema by assigning to a varaiable. This variable gives a Schema that we store
var Quote = mongoose.model('Quote'); 

///////////////ROUTES////////////////
app.get('/', function(req, res) { 
	res.render("index", {title: 'Quoting App'});

})

app.post('/quotes', function(req,res){
	console.log("POST DATA", req.body);
	var quote = new Quote({name: req.body.name, quote: req.body.quote, vote: req.body.vote});
	  quote.save(function(err) {
	    if(err) {
	      console.log('something went wrong');
	    } 
	    else { 
	      console.log('successfully added a quote!');
	      res.redirect('/quotes');
	    }
	})
})

app.get('/quotes', function(req, res) { 
	Quote.find({}).sort({vote: 'desc'}).exec(function(err, quotes) { // To sort quotes in desc by createdAt change vote: createdAt
		if (err){
					res.json(err)
					console.log(err)
				}
		else{
				res.render("quotes", {title: 'Quoting App ', quotes: quotes});
		}
	
	})
})

app.get('/:id/update', function(req, res) { 
	Quote.findOne({_id:req.params.id}, function(err,quotes){
	 	if (err){
				res.json(err)
				console.log(err)
				}
		else{
			res.render("edit", {title: 'Quoting App', quotes:quotes});
			}
	})
})

app.post('/:id',function(req,res){
	Quote.update({_id:req.params.id}, { vote: req.body.vote}, function(err){
		if(err){
			res.json(err)
		}
		else{
			res.redirect('/quotes')
		}
	})
})

app.listen(8000, function() {
 console.log("listening on port 8000");
})

