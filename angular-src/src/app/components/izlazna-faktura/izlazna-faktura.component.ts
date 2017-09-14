import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-izlazna-faktura',
  templateUrl: './izlazna-faktura.component.html',
  styleUrls: ['./izlazna-faktura.component.css']
})
export class IzlaznaFakturaComponent implements OnInit {

		invNumber: String = "invNumberPH";
		total: String = "sumNumberPH";

  constructor() { }

  ngOnInit() {
  }

}
