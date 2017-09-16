var express = require('express');
var router = express.Router();
var Item = require('../models/item.model');

// Get Item
router.get('/get/item/:itemId', function (req, res, next) {
	Item.getItem(req.params.itemId, (err, result)=>{
		if(err)
			return res.json({ success: false, msg:"Dobavljanje neuspešno" });
		res.json({ success: true, item: result });
	});
});

// Get Items
router.get('/get/warehouse/:username', function (req, res, next) {
	Item.getItems(req.params.username, (err, result)=>{
		if(err)
			return res.json({ success: false, msg:"Dobavljanje artikala neuspešno" });
		res.json({ success: true, items: result });
	});
});

// Get Items from Archive
router.get('/get/archive/:username', function (req, res, next) {
	Item.getArchivedItems(req.params.username, (err, result)=>{
		if(err)
			return res.json({ success: false, msg:"Dobavljanje arhiviranih artikala neušpesno" });
		res.json({ success: true, items: result });
	});
});

// Move to Archive
router.delete('/archive/item/:itemId', function (req, res, next) {
	Item.moveToArchive(req.params.itemId, (err)=>{
		if(err)
			return res.json({ success: false, msg:"Arhiviranje neuspešno" });
		res.json({ success: true, msg:"Arhiviranje uspešno" });
	});
});

// Update Item
router.put('/update/item/:itemId', function (req, res, next) {
	var update = {
		newCode: req.body.newCode,
		newName: req.body.newName
	}
	Item.updateItem(req.params.itemId, update, (err, updatedItem)=>{
		if(err)
			return res.json({ success: false, msg:"Ažuriranje neuspešno" });
		res.json({ success: true, msg:"Ažuriranje uspešno", item: updatedItem });
	});
});

module.exports = router;