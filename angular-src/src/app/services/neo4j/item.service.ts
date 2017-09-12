import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ItemService {

  constructor(private http: Http) { }
 		
	getArchItems(userId){
	return this.http.get('http://localhost:7474/archive/' + userId)
	.map(res => res.json());
	}
}
