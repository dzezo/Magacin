import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ItemService {

  constructor(private http: Http) { }
 		
	getArchItems(username){
	return this.http.get('http://localhost:3000/items/get/archive/' + username)
	.map(res => res.json());
	}
}
