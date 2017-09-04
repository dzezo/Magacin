var express = require('express');
var router = express.Router();
var Item = require('../models/item.model');

// Get Item
router.get('/get/item/:username/:code', function (req, res, next) {
	Item.getItem(req.params.username, req.params.code, (err, result)=>{
		if(err)
			return res.json({ success:false, msg:"Dobavljanje neuspesno" });
		res.json({ success: true, item: result });
	});
});

// Get Items
router.get('/get/instock/:username', function (req, res, next) {
	Item.getItems(req.params.username, (err, result)=>{
		if(err)
			return res.json({ success:false, msg:"Dobavljanje artikala neuspesno" });
		res.json({ success: true, items: result });
	});
});

// Get Items from Archive
router.get('/get/archive/:username', function (req, res, next) {
	Item.getArchivedItems(req.params.username, (err, result)=>{
		if(err)
			return res.json({ success:false, msg:"Dobavljanje arhiviranih artikala neuspesno" });
		res.json({ success: true, items: result });
	});
});

// Update Item
router.put('/update/item/:username/:code', function (req, res, next) {
	var update = {
		newCode: req.body.code,
		newName: req.body.newName
	};
	Item.updateItem(req.params.username, req.params.code, update, (err, newItem)=>{
		if(err)
			return res.json({ success:false, msg:"Azuriranje neuspesno" });
		res.json({ success: true, msg:"Azuriranje uspesno", item: newItem });
	});
});

// Move to Archive
router.delete('/archive/item/:username/:code', function (req, res, next) {
	Item.moveToArchive(req.params.username, req.params.code, (err)=>{
		if(err)
			return res.json({ success:false, msg:"Arhiviranje neuspesno" });
		res.json({ success: true, msg:"Arhiviranje uspesno" });
	});
});

module.exports = router;