import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ItemService {

  	constructor(private http: Http) { }

  	// GET
  	getItem(itemId){
  		return this.http.get('http://localhost:3000/items/get/item/' + itemId)
			.map(res => res.json());
  	}
 		
	getArchItems(username){
		return this.http.get('http://localhost:3000/items/get/archive/' + username)
			.map(res => res.json());
	}

	getItems(username){
		return this.http.get('http://localhost:3000/items/get/warehouse/' + username)
			.map(res => res.json());
	}

	// DELETE
	archiveItem(itemId) {
		return this.http.delete('http://localhost:3000/items/archive/item/' + itemId)
			.map(res => res.json());
	}

	// PUT
	updateItem(itemId, newItem) {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.put('http://localhost:3000/items/update/item/' + itemId, JSON.stringify(newItem), {headers: headers})
      		.map(res => res.json());
	}
}
