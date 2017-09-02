var express = require('express');
var router = express.Router();
var Invoice = require('../models/invoice.model');

// Add Input Invoice
router.post('/add/input/:username', function (req, res, next) {
	// Create invoice
	var newInvoice = {
		supplier: req.body.supplier,
		taxId: req.body.taxId,
		refNumber: req.body.refNumber,
		invNumber: req.body.invNumber,
		recvDate: req.body.recvDate,
		expDate: req.body.expDate,
		total: req.body.total,
		items: req.body.items
	}

	Invoice.addInputInvoice(req.params.username, newInvoice, (err, result) => {
		if(err)
			return res.json({ success: false, msg: "Fakturisanje neuspesno"});
		res.json({ 
			success: true, 
			msg: "Fakturisanje uspesno",
			invoice: result
		});
	});
});

// Add Output Invoice
router.post('/add/output/:username', function (req, res, next) {
	// Create invoice
	var newInvoice = {
		purchaser: req.body.purchaser,
		invNumber: req.body.invNumber,
		issueDate: req.body.issueDate,
		total: req.body.total,
		items: req.body.items
	}

	Invoice.addOutputInvoice(req.params.username, newInvoice, (err, result) => {
		if(err)
			return res.json({ success: false, msg: "Fakturisanje neuspesno"});
		res.json({ 
			success: true, 
			msg: "Fakturisanje uspesno",
			invoice: result
		});
	});
});

module.exports = router;