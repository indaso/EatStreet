var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/eatstreet');
var yelp = require("yelp").createClient({
	consumer_key: "fXEIkG46HeajTe4_iV1fPQ",
	consumer_secret: "tknPjivXi1DFrj7K7_FlUCOdRjM",
	token: "dJtzxs74deSktgEDZeCjS7Hz8l9BKTxk",
	token_secret: "WNQNxYmuElS5GUNF6fIbPtDocLk"
});

//Render request page
router.get('/locations', function (req, res) {
	res.render('locations');
});

//Get location suggestions for the group requested:
router.post('/locations', function (req, res) {
	//get groupname from form
	var testgroup = 'dog';
	var groupname = req.body.groupname;
	console.log(groupname);

	//Connect to the db
	MongoClient.connect("mongodb://localhost:27017/eatstreet", function (err, db) {
		if (!err) {
			console.log("We are connected");
		}
		var collection = db.collection(testgroup);
		console.log(collection);

		collection.find().toArray(function (err, items) {});

	});

	//get yelp api suggestions
	var namelist = [];
	var phonelist = [];
	var distancelist = [];
	var ratinglist = [];
	var addresslist = [];

	yelp.search({
		term: "food",
		ll: "39.952257, -75.191186",
		radius: 5
	}, function (error, data) {
		console.log(error);

		for (var i = 0; i < 20; i++) {
			namelist[i] = data.businesses[i].name;
			phonelist[i] = data.businesses[i].phone;
			distancelist[i] = data.businesses[i].distance;
			ratinglist[i] = data.businesses[i].rating;
			addresslist[i] = data.businesses[i].location.address;
		}

		//present relevant information to client
		res.render('results', {
			names: namelist,
			phones: phonelist,
			distances: distancelist,
			ratings: ratinglist,
			addresses: addresslist
		});
	});
});



module.exports = router;