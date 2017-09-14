import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ulazna-faktura',
  templateUrl: './ulazna-faktura.component.html',
  styleUrls: ['./ulazna-faktura.component.css']
})
export class UlaznaFakturaComponent implements OnInit {

	invNumber: String = "invNumberPH";
	total: String = "sumNumberPH";

  constructor() { }

  ngOnInit() {
  }

}
