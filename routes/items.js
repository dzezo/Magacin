var express = require('express');
var router = express.Router();
var Item = require('../models/item.model');

// Add Item
router.post('/add/:username', function (req, res, next) {
	// Create item
	var newItem = {
		code: req.body.code,
		name: req.body.name,
		quantity: req.body.quantity,
		purchaseP: req.body.purchaseP,
		sellingP: req.body.sellingP
	}
	// Check for item
	Item.getItemByName(newItem.name, function(item){
		// Exists
		if(item)
			return res.json({ success: false });
		// Add new item
		Item.addItem(newItem, req.params.username, res);
	});
});

// Get Item

// Get Items from Stack

// Get Items from Archive

// Update Item

// Move to Archive

// Delete Item

module.exports = router;