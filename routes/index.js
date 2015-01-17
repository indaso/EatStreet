var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
	res.render('index', {
		title: 'Express'
	});
});

router.post('/createGroup', function (req, res) {
	var db = req.db;

	var name = req.body.name;
	var groupId = Math.floor(Math.random() * 10000);

	var group = db.get('group');

	var newuser = {
		"_id": groupId,
		"members": [{
			"name": name
		}]
	};

	group.insert(newuser, function (err, doc) {
		if (err)
			res.send("Error: Unable to add information to the database");
		else {
			res.redirect("map");
		}
	})
});

router.get('/map', function (req, res) {

});
module.exports = router;