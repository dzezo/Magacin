var express = require('express');
var router = express.Router();
var Supplier = require('../models/supplier.model');

// Add Supplier Manual
router.post('/add/:username', function(req, res, next) {
	var supplier = {
		name: req.body.name,
		taxId: req.body.taxId
	};
	Supplier.addSupplier(req.params.username, supplier, (err, message)=>{
		if(err)
			return res.json({ success: false, msg: message });
		res.json({ success: true, msg: message });
	});
});

// Add Supplier Auto
router.post('/invoice/add/:username', function(req, res, next) {
	var supplier = {
		name: req.body.name,
		taxId: req.body.taxId
	};
	Supplier.addSupplierFromInvoice(req.params.username, supplier, (err)=>{
		if(err)
			return res.json({ success: false });
		res.json({ success: true });
	});
});

// Search Supplier
router.get('/search/:search/user/:username', function(req, res, next) {
	Supplier.searchSupplier(req.params.username, req.params.search, (err, suggestion)=>{
		if(err)
			return res.json({ success: false, error: err });
		res.json({ success: true, suggestion: suggestion });
	});
});

// Get Supplier
router.get('/get/:name/user/:username', function(req, res, next) {
	Supplier.getSupplier(req.params.username, req.params.name, (err, supplier)=>{
		if(err)
			return res.json({ success: false, msg: "Dobavljanje neuspešno" });
		res.json({ success: true, supplier: supplier });
	});
});

// Get Suppliers
router.get('/user/:username', function(req, res, next) {
	Supplier.getSuppliers(req.params.username, (err, suppliers)=>{
		if(err)
			return res.json({ success: false, msg: "Dobavljanje neuspešno" });
		res.json({ success: true, suppliers: suppliers });
	});
});

// Delete Supplier
router.delete('/delete/:name/user/:username', function(req, res, next) {
	Supplier.deleteSupplier(req.params.username, req.params.name, (err)=>{
		if(err)
			return res.json({ success: false, msg: "Brisanje neuspešno" });
		res.json({ success: true, msg: "Brisanje uspešno" });
	});
});

// Undo Supplier
router.delete('/undo/:name/user/:username', function(req, res, next) {
	Supplier.undoSupplier(req.params.username, req.params.name, (err)=>{
		if(err)
			return res.json({ success: false });
		res.json({ success: true });
	});
});

module.exports = router;