import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class SupplierService {

  	constructor(private http: Http) { }
  	
  	// POST
  	// ADD SUPPLIER
	addSupplier(username, newSupplier){
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post('http://localhost:3000/suppliers/add/' + encodeURIComponent(username), JSON.stringify(newSupplier), {headers: headers})
			.map(res => res.json());
	}

	// ADD SUPPLIER FROM INVOICE
	invAddSupplier(username, newSupplier){
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post('http://localhost:3000/suppliers/invoice/add/' + encodeURIComponent(username), JSON.stringify(newSupplier), {headers: headers})
			.map(res => res.json());
	}

	// GET
	// SEARCH FOR SUPPLIER
	searchSupplier(username, search){
	return this.http.get('http://localhost:3000/suppliers/search/' + encodeURIComponent(search) + '/user/' + encodeURIComponent(username))
		.map(res => res.json());
	}

	// GET SPECIFIC SUPPLIER
	getSupplier(username, supplierName){
	return this.http.get('http://localhost:3000/suppliers/get/' + encodeURIComponent(supplierName) + '/user/' + encodeURIComponent(username))
		.map(res => res.json());
	}

	// GET ALL SUPPLIERS 
	getSuppliers(username){
	return this.http.get('http://localhost:3000/suppliers/user/' + encodeURIComponent(username))
		.map(res => res.json());
	}

	// DELETE
	// DELETE BY NAME
	deleteSupplier(username, supplierName){
	return this.http.delete('http://localhost:3000/suppliers/delete/' + encodeURIComponent(supplierName) + '/user/' + encodeURIComponent(username))
		.map(res => res.json());
	}

	// UNDO WITH INVOICE
	undoSupplier(username, supplierName){
	return this.http.delete('http://localhost:3000/suppliers/undo/' + encodeURIComponent(supplierName) +'/user/' + encodeURIComponent(username))
		.map(res => res.json());
	}
}