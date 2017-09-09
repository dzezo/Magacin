import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ulaz',
  templateUrl: './ulaz.component.html',
  styleUrls: ['./ulaz.component.css']
})
export class UlazComponent implements OnInit {

	bla: String = "0";

	// ngModel
	nazivDobavljaca: String;
	pib: String;
	pozivNaBroj: String;
	brojRacuna: String;
	datumDospeca: String;
	datumIsteka: String;

  constructor() { }

  ngOnInit() {
  }

}
