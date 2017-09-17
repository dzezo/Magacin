var express = require('express');
var router = express.Router();
var Warehouse = require('../models/warehouse.model');

// Add Items (Array)
router.post('/add/:username', function(req, res, next) {
	Warehouse.AddItems(req.params.username, req.body.items, (err)=>{
		if(err)
			return res.json({ success: false });
		res.json({ success: true });
	});
});

// Search for Item
router.get('/search/:search/user/:username', function(req, res, next) {
	Warehouse.searchForItem(req.params.username, req.params.search, (err, suggestion)=>{
		if(err)
			return res.json({ success: false, error: err });
		res.json({ success: true, suggestion: suggestion });
	});
});

// Get Item (Code)
router.get('/code/:code/user/:username', function(req, res, next) {
	Warehouse.getItemCode(req.params.username, req.params.code, (err, item)=>{
		if(err)
			return res.json({ success: false, error: err });
		res.json({ success: true, item: item });
	});
});

// Get Item (Name)
router.get('/name/:name/user/:username', function(req, res, next) {
	Warehouse.getItemName(req.params.username, req.params.name, (err, item)=>{
		if(err)
			return res.json({ success: false, error: err });
		res.json({ success: true, item: item });
	});
});

// Delete Item
router.delete('/delete/:name/user/:username', function(req, res, next) {
	Warehouse.deleteItem(req.params.username, req.params.name, (err)=>{
		if(err){
			console.log(err);
			return res.json({ success: false });
		}
		res.json({ success: true });
	});
});

// Undo Items
router.put('/undo/user/:username', function(req, res, next) {
	Warehouse.undoItems(req.params.username, req.body.items, (err)=>{
		if(err){
			console.log(err);
			return res.json({ success: false });
		}
		res.json({ success: true });
	});
});

// Update Item
router.put('/update/:name/user/:username', function(req, res, next) {
	var update = {
		newCode: req.body.newCode,
		newName: req.body.newName
	}
	Warehouse.updateItem(req.params.username, req.params.name, update, (err)=>{
		if(err)
			return res.json({ success: false });
		res.json({ success: true });
	});
});

module.exports = router;