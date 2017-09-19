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

	Invoice.addInputInvoice(req.params.username, newInvoice, (err) => {
		if(err)
			return res.json({ success: false, msg: "Fakturisanje neuspešno"});
		res.json({ success: true, msg: "Fakturisanje uspešno" });
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

	Invoice.addOutputInvoice(req.params.username, newInvoice, (err) => {
		if(err)
			return res.json({ success: false, msg: "Fakturisanje neuspešno"});
		res.json({ success: true, msg: "Fakturisanje uspešno" });
	});
});

// Get Input Invoices
router.get('/get/input/:username', function(req, res, next) {
	Invoice.getInputInvoices(req.params.username, (err, result) => {
		if(err)
			return res.json({ success: false, msg:"Dobavljanje ulaznih faktura neuspešno" })
		res.json({ success: true, invoices: result })
	});
});

// Get Output Invoices
router.get('/get/output/:username', function(req, res, next) {
	Invoice.getOutputInvoices(req.params.username, (err, result) => {
		if(err)
			return res.json({ success: false, msg:"Dobavljanje izlaznih faktura neuspešno" })
		res.json({ success: true, invoices: result })
	});
});

// Get Input Invoice Details
router.get('/get/input/invoice/:invoiceId', function(req, res, next) {
	Invoice.getInputInvoice(req.params.invoiceId, (err, result) => {
		if(err)
			return res.json({ success: false, msg:"Dobavljanje ulazne fakture neuspešno" })
		res.json({ success: true, invoice: result })
	});
});

// Get Output Invoice Details
router.get('/get/output/invoice/:invoiceId', function(req, res, next) {
	Invoice.getOutputInvoice(req.params.invoiceId, (err, result) => {
		if(err)
			return res.json({ success: false, msg:"Dobavljanje izlazne fakture neuspešno" })
		res.json({ success: true, invoice: result })
	});
});

// Undo Input Invoice
router.delete('/undo/input/invoice/:invoiceId', function(req, res, next) {
	Invoice.undoInputInvoice(req.params.invoiceId, (err) => {
		if(err)
			return res.json({ success: false, msg:"Ukidanje ulazne fakture neuspešno" })
		res.json({ success: true, msg:"Ukidanje ulazne fakture uspešno" })
	});
});

// Undo Output Invoice
router.delete('/undo/output/invoice/:invoiceId', function(req, res, next) {
	Invoice.undoOutputInvoice(req.params.invoiceId, (err) => {
		if(err)
			return res.json({ success: false, msg:"Ukidanje izlazne fakture neuspešno" })
		res.json({ success: true, msg:"Ukidanje izlazne fakture uspešno" })
	});
});

// Update Input Invoice
router.put('/update/input/invoice/:invoiceId', function(req, res, next) {
	Invoice.updateInputInvoice(req.params.invoiceId, req.body, (err) => {
		if(err)
			return res.json({ success: false, msg:"Ažuriranje fakture neuspešno" })
		res.json({ success: true, msg:"Ažuriranje fakture uspešno" })
	});
});


module.exports = router;