var express = require('express');
var router = express.Router();
var session = require('express-session');

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
		var new_group = {
			"groupid": groupName,
			"members": [{"name": name, "latitude": latitude, "longitude":longitude}]
		};
		users.insert(new_group, function (err, doc) {
			if (err)
				res.send("Error: Unable to add information to the database");
			else {
				req.session.group = groupName;
				res.redirect("map");
			}
		});

	}

	else if (username != "" && groupId != "") {
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
					req.session.group = groupId;
					res.redirect("map");
				}
			});
		}
	}


	
});

router.get('/map', function (req, res) {
	var db = req.db;
	var users = db.get('users');
	var groupid = req.session.group;
	console.log("GROUP ID: " + groupid);
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

			res.render('map', {
				title: 'MAP',
				coords: JSON.stringify(all_coords),
				centerX: centerX,
				centerY: centerY
			});
		}
	});
	
	
});


module.exports = router;