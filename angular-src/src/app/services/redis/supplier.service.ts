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
		return this.http.post('suppliers/add/' + encodeURIComponent(username), JSON.stringify(newSupplier), {headers: headers})
			.map(res => res.json());
	}

	// ADD SUPPLIER FROM INVOICE
	invAddSupplier(username, newSupplier){
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post('suppliers/invoice/add/' + encodeURIComponent(username), JSON.stringify(newSupplier), {headers: headers})
			.map(res => res.json());
	}

	// GET
	// SEARCH FOR SUPPLIER
	searchSupplier(username, search){
	return this.http.get('suppliers/search/' + encodeURIComponent(search) + '/user/' + encodeURIComponent(username))
		.map(res => res.json());
	}

	// GET SPECIFIC SUPPLIER
	getSupplier(username, supplierName){
	return this.http.get('suppliers/get/' + encodeURIComponent(supplierName) + '/user/' + encodeURIComponent(username))
		.map(res => res.json());
	}

	// GET ALL SUPPLIERS 
	getSuppliers(username){
	return this.http.get('suppliers/user/' + encodeURIComponent(username))
		.map(res => res.json());
	}

	// DELETE
	// DELETE BY NAME
	deleteSupplier(username, supplierName){
	return this.http.delete('suppliers/delete/' + encodeURIComponent(supplierName) + '/user/' + encodeURIComponent(username))
		.map(res => res.json());
	}

	// UNDO WITH INVOICE
	undoSupplier(username, supplierName){
	return this.http.delete('suppliers/undo/' + encodeURIComponent(supplierName) +'/user/' + encodeURIComponent(username))
		.map(res => res.json());
	}
}