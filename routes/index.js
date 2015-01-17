var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
	res.render('index', {
		title: 'Express'
	});
});


router.post('/', function (req, res) {
	var db = req.db;
	var users = db.get('users');
	var name = req.body.name;
	var groupName = req.body.newgroup;
	var username = req.body.username;
	var groupId = req.body.groupid;
	var latitude = req.body.latitude;
	var longitude = req.body.longitude;
	
	if (name != "" && groupName != "") {	
		console.log("HERE");
		var new_group = {
			"groupid": groupName,
			"members": [{"name": name, "latitude": latitude, "longitude":longitude}]
		};
		users.insert(new_group, function (err, doc) {
			if (err)
				res.send("Error: Unable to add information to the database");
			else {
				res.redirect("map");
			}
		});
	}

	else if (username != "" && groupId != "") {
		console.log("JOIN GROUP");
		var currGroup = users.find({"groupid":groupId});
		if (currGroup == "") {
			console.log("Error: Unable to find group in the database");
		}
		else {
			var new_member = {"name":username,"latitude":latitude,"longitude":longitude};
 			users.update({"groupid":groupId},{"$push":{"members":new_member}}, function (err, doc) {
				if (err)
					res.send("Error: Unable to add information to the database");
				else {
					res.redirect("map");
				}
			});
		}
	}


	
});

router.get('/map', function (req, res) {
	res.render('index', {
		title: 'MAP'
	});
});


module.exports = router;