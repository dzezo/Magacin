import { Component, OnInit, ElementRef } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-izlaz',
  templateUrl: './izlaz.component.html',
  styleUrls: ['./izlaz.component.css']
})
export class IzlazComponent implements OnInit {
    	// Tabela
      // Redovi u tabeli
      rowData = [];
      rowId = 0;
      // Faktura
      sum = 0;
      // Datumi
      recvDate: any;
      expDate: any;

  constructor(private elRef: ElementRef) { }

  ngOnInit() {
      // DATE PLUG-IN INIT
    this.recvDate = $(this.elRef.nativeElement).find('#buyer-receiptDate');
    this.recvDate.datepicker();
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
        var sellingP;
        for(var i=0; i<this.rowData.length; i++){
          // isNaN vraca false ako je broj
          quantity = this.rowData[i].quantity;
          sellingP = this.rowData[i].sellingP;
          if(! (isNaN(quantity) || isNaN(sellingP)) ){
            this.sum += (parseInt(quantity) * parseInt(sellingP));
          }
        }
      }

      // Predaj fakturu
      submitInvoice(){
        for(var i=0; i<this.rowData.length; i++)
          console.log(this.rowData[i]);
      }
}
