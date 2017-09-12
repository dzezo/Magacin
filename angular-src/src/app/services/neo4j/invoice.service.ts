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

	// DELETE

}
