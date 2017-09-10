import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ulaz',
  templateUrl: './ulaz.component.html',
  styleUrls: ['./ulaz.component.css']
})
export class UlazComponent implements OnInit {
	// Tabela
	// Redovi u tabeli
	rowData = [];
	rowId = 0;
	// Faktura
	sum = 0;

	constructor() { }

	ngOnInit() {
	}

	// Metode za tabelu
	// Svaki red po kreiranju dobija samo id
	addRow(id){
		this.rowData.push({
			id: id
		});
		this.rowId++;
	}

	removeRow(id){
		for(var i=0; i<this.rowData.length; i++){
			if(this.rowData[i].id == id)
				this.rowData.splice(i,1);
		}
		// Azuriraj sumu
		this.sumInvoice();
	}

	// Metode za fakturu
	// Sumiraj fakturu
	sumInvoice(){
		this.sum = 0;
		var quantity;
		var purchaseP;
		for(var i=0; i<this.rowData.length; i++){
			// isNaN vraca false ako je broj
			quantity = this.rowData[i].quantity;
			purchaseP = this.rowData[i].purchaseP;
			if(! (isNaN(quantity) || isNaN(purchaseP)) ){
				this.sum += (parseInt(quantity) * parseInt(purchaseP));
			}
		}
	}

	// Predaj fakturu
	submitInvoice(){
		for(var i=0; i<this.rowData.length; i++)
			console.log(this.rowData[i]);
	}
}
