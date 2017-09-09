import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-izlaz',
  templateUrl: './izlaz.component.html',
  styleUrls: ['./izlaz.component.css']
})
export class IzlazComponent implements OnInit {

	bla: String = "0";

	// ngModel
  kupac: String;
  brojRacuna: String;
  datumIzdavanjaRacuna: String;

  constructor() { }

  ngOnInit() {
  }

}
