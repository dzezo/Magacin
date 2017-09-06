import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-magacin',
  templateUrl: './magacin.component.html',
  styleUrls: ['./magacin.component.css']
})
export class MagacinComponent implements OnInit {

	ukupnoPoN: String = "0";
	ukupnoPoProd: String = "0";

  constructor() { }

  ngOnInit() {
  }

}
