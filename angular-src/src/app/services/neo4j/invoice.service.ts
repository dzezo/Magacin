import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class InvoiceService {

	constructor(private http: Http) { }

	// POST
	// ADD INPUT INVOICE
	addInputInvoice(username, newInvoice){
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post('http://localhost:3000/invoices/add/input/' + username, JSON.stringify(newInvoice), {headers: headers})
			.map(res => res.json());
	}

	// ADD OUTPUT INVOICE
	addOutputInvoice(username, newInvoice){
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post('http://localhost:3000/invoices/add/output/' + username, JSON.stringify(newInvoice), {headers: headers})
			.map(res => res.json());
	}

	// GET
	// GET INPUT INVOICES
	getInputInvoices(username){
		return this.http.get('http://localhost:3000/invoices/get/input/' + username)
			.map(res => res.json());
	}

	// GET OUTPUT INVOICES
	getOutputInvoices(username){
		return this.http.get('http://localhost:3000/invoices/get/output/' + username)
			.map(res => res.json());
	}

	// GET INPUT INVOICE
	getInputInvoice(invoiceId){
		return this.http.get('http://localhost:3000/invoices/get/input/invoice/' + invoiceId)
			.map(res => res.json());
	}

	// GET OUTPUT INVOICE
	getOutputInvoice(invoiceId){
		return this.http.get('http://localhost:3000/invoices/get/output/invoice/' + invoiceId)
			.map(res => res.json());
	}

	// DELETE
	// UNDO INPUT INVOICE
	undoInput(invoiceId){
	return this.http.delete('http://localhost:3000/invoices/undo/input/invoice/' + invoiceId)
		.map(res => res.json());
	}

	// UNDO OUTPUT INVOICE
	undoOutput(invoiceId){
	return this.http.delete('http://localhost:3000/invoices/undo/output/invoice/' + invoiceId)
		.map(res => res.json());
	}


}
