
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class WarehouseService {

 	constructor(private http: Http) { }

 	// POST
 	// ADD ITEMS
 	addItems(username, items){
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post('http://localhost:3000/warehouses/add/' + encodeURIComponent(username), JSON.stringify(items), {headers: headers})
			.map(res => res.json());
	}

  	// GET
  	// SEARCH ITEM
  	searchItem(username, search){
		return this.http.get('http://localhost:3000/warehouses/search/' + encodeURIComponent(search) + '/user/' + encodeURIComponent(username))
			.map(res => res.json());
	}

  	// GET ITEM BY NAME
  	getItemName(username, name){
		return this.http.get('http://localhost:3000/warehouses/name/' + encodeURIComponent(name) + '/user/' + encodeURIComponent(username))
			.map(res => res.json());
	}

  	// GET ITEM BY CODE
	getItemCode(username, code){
		return this.http.get('http://localhost:3000/warehouses/code/' + code + '/user/' + encodeURIComponent(username))
			.map(res => res.json());
	}

	// DELETE
	// SEND ITEM TO ARCHIVE
	sendToArchive(username, itemName){
		return this.http.delete('http://localhost:3000/warehouses/delete/' + encodeURIComponent(itemName) + '/user/' + encodeURIComponent(username))
			.map(res => res.json());
	}

	// PUT
	// UPDATE
	updateItem(username, itemName, newItem){
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.put('http://localhost:3000/warehouses/update/' + encodeURIComponent(itemName) + '/user/' + encodeURIComponent(username), JSON.stringify(newItem), {headers: headers})
			.map(res => res.json());
	}

	// UNDO ITEMS WITH INVOICE
	undoItems(username, items){
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.put('http://localhost:3000/warehouses/undo/user/' + encodeURIComponent(username), JSON.stringify(items), {headers: headers})
			.map(res => res.json());
	}
}
