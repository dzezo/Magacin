import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-magacin',
  templateUrl: './magacin.component.html',
  styleUrls: ['./magacin.component.css']
})
export class MagacinComponent implements OnInit {
	// Placeholders
	ukupnoPoN: String = "0";
	ukupnoPoProd: String = "0";
	//Artikl
	artiklID: any;
	// Edit modal
	editModal: any;
	artiklSifra: String = "";
	artiklIme: String = "";

  constructor(private router: Router) { }

  ngOnInit() {
  }

	clickedItem(artiklID, sifra, ime){
		this.artiklID = artiklID;
	this.artiklIme = ime;
	this.artiklSifra = sifra;
	}

	getArtikl (artiklId){
	localStorage.setItem('artikl',artiklId);
	this.router.navigate(['/artikl']);
	}

}
