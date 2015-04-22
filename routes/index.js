var express = require('express');
var router = express.Router();
var DecisionTree = require('decision-tree');
var db = require('./db.js');

/* GET home page. */
router.get('/', function(req, res, next) {

	res.render('index.html');
});

/* GET decision tree */
router.get('/tree', function(req, res) {
	
	var training_data = db.getData();
	var class_name = "name";
	var features = ["gender", "livingStatus", "movie", "oscar", "cityBorn", "relationshipStatus", "genre", "ethnicity"];
	var dt = new DecisionTree(training_data, class_name, features);
	var treeModel = dt.toJSON();

	res.json({tree: treeModel});
});


module.exports = router;
