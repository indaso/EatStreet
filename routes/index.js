var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


router.post('/', function(req, res) {
	var db = req.db;

	console.log(db);

	var name = req.body.name;
	var groupId = Math.floor(Math.random() * 10000);

	var group = db.get('users');

	
	var latitude, longitude;

	if (navigator.geolocation) {
		navigator.geolocation.watchPosition(function showPosition(position) {
			latitude = position.coords.latitude;
			longitude = position.coords.longitude;
		});
	}
	else {
		console.log("ERROR");
	}


	var new_group = {"groupid":groupId,"members":[{"name":name}]};
	group.insert(new_group,function(err, doc) {
			if (err)
				res.send("Error: Unable to add information to the database");
			else {
				console.log("ADDED");
				res.redirect("map");
			}
		});
});

router.get('/map',function(req,res) {
	res.render('index', { title: 'MAP' });
});


module.exports = router;
