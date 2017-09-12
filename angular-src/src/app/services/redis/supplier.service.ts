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
		return this.http.post('http://localhost:3000/suppliers/add/' + username, JSON.stringify(newSupplier), {headers: headers})
			.map(res => res.json());
	}

	// ADD SUPPLIER FROM INVOICE
	invAddSupplier(username, newSupplier){
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post('http://localhost:3000/suppliers/invoice/add/' + username, JSON.stringify(newSupplier), {headers: headers})
			.map(res => res.json());
	}

	// GET
	// SEARCH FOR SUPPLIER
	searchSupplier(username, search){
	return this.http.get('http://localhost:3000/suppliers/search/' + search + '/user/' + username)
		.map(res => res.json());
	}

	// GET SPECIFIC SUPPLIER
	getSupplier(username, supplierName){
	return this.http.get('http://localhost:3000/suppliers/get/' + supplierName + '/user/' + username)
		.map(res => res.json());
	}

	// GET ALL SUPPLIERS 
	getSuppliers(username){
	return this.http.get('http://localhost:3000/suppliers/user/' + username)
		.map(res => res.json());
	}

	// DELETE
	// DELETE BY NAME
	deleteSupplier(username, supplierName){
	return this.http.delete('http://localhost:3000/suppliers/delete/' + supplierName + '/user/' + username)
		.map(res => res.json());
	}

	// DELETE FROM INVOICE
	invDeleteSupplier(username, supplierName){
	return this.http.delete('http://localhost:3000/suppliers/undo/' + supplierName +' /user/' + username)
		.map(res => res.json());
	}
}