var express = require('express');
var router = express.Router();

var yelp = require("yelp").createClient({
	consumer_key: "fXEIkG46HeajTe4_iV1fPQ",
	consumer_secret: "tknPjivXi1DFrj7K7_FlUCOdRjM",
	token: "dJtzxs74deSktgEDZeCjS7Hz8l9BKTxk",
	token_secret: "WNQNxYmuElS5GUNF6fIbPtDocLk"
});

var session = require('express-session');

//Render request page
router.get('/locations', function (req, res) {
	res.render('locations');
});

//Get location suggestions for the group requested:
router.post('/locations', function (req, res) {
	console.log("HERE");
	var db = req.db;
	var users = db.get('users');
	//get groupname from form
	var groupname = req.body.groupname;
	req.session.group = groupname;
	console.log(groupname);
	res.redirect("map");

	
});

router.get('/map', function (req, res) {
	var db = req.db;
	var users = db.get('users');
	var groupid = req.session.group;
	var sumX = 0;
	var sumY = 0;
	var centerX;
	var centerY;
	var all_coords = [];

	users.findOne({"groupid":groupid}, function(err, document) {
		if (err)
			throw err;
		else {

			var members = document.members;
			for (var i = 0; i < members.length; i++	) {
				var coord = [parseFloat(members[i].latitude),parseFloat(members[i].longitude)];
				all_coords.push(coord);
				sumX += parseFloat(members[i].latitude);
				sumY += parseFloat(members[i].longitude);
				console.log(sumX);
				console.log(sumY);
			}

			centerX = sumX / members.length;
			centerY = sumY / members.length;

			console.log("Center X : " + centerX);
			console.log("Center Y : " + centerY);
			console.log(all_coords);

			users.update({"groupid":groupid},{"$set":{"centerX":centerX,"centerY":centerY}});


			var center = "" + centerX + "," + centerY;
			console.log(center);
			//get yelp api suggestions
			var namelist = [];
			var phonelist = [];
			var distancelist = [];
			var ratinglist = [];
			var addresslist = [];

			yelp.search({
				term: "food",
				ll: center,
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

				// //present relevant information to client
				// res.render('results', {
				// 	names: namelist,
				// 	phones: phonelist,
				// 	distances: distancelist,
				// 	ratings: ratinglist,
				// 	addresses: addresslist
				// });
				res.render('map', {
					title: 'MAP',
					coords: JSON.stringify(all_coords),
					centerX: centerX,
					centerY: centerY,
					names: namelist,
					phones: phonelist,
					distances: distancelist,
					ratings: ratinglist,
					addresses: addresslist
				});
			});

			
		}
	});
	
	
});




module.exports = router;