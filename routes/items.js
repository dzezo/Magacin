var express = require('express');
var router = express.Router();
var Item = require('../models/item.model');

// Get Item
router.get('/get/item/:itemId', function (req, res, next) {
	Item.getItem(req.params.itemId, (err, result)=>{
		if(err)
			return res.json({ success: false, msg:"Dobavljanje neuspesno" });
		res.json({ success: true, item: result });
	});
});

// Get Items
router.get('/get/instock/:username', function (req, res, next) {
	Item.getItems(req.params.username, (err, result)=>{
		if(err)
			return res.json({ success: false, msg:"Dobavljanje artikala neuspesno" });
		res.json({ success: true, items: result });
	});
});

// Get Items from Archive
router.get('/get/archive/:username', function (req, res, next) {
	Item.getArchivedItems(req.params.username, (err, result)=>{
		if(err)
			return res.json({ success: false, msg:"Dobavljanje arhiviranih artikala neuspesno" });
		res.json({ success: true, items: result });
	});
});

// Move to Archive
router.delete('/archive/item/:itemId', function (req, res, next) {
	Item.moveToArchive(req.params.itemId, (err)=>{
		if(err)
			return res.json({ success: false, msg:"Arhiviranje neuspesno" });
		res.json({ success: true, msg:"Arhiviranje uspesno" });
	});
});

module.exports = router;