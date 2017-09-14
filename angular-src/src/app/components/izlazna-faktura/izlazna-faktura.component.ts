import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { InvoiceService } from '../../services/neo4j/invoice.service';

@Component({
  selector: 'app-izlazna-faktura',
  templateUrl: './izlazna-faktura.component.html',
  styleUrls: ['./izlazna-faktura.component.css']
})
export class IzlaznaFakturaComponent implements OnInit {
    // Reference
  	user: any;
  	invoiceId: any;
  	// Arrays
  	Artikli = [];
  	// Faktura
  	invNumber: String;
  	purchaser: String;
  	issueDate: String;
  	total: String;

  	constructor(private router: Router,
              private flashMessage: FlashMessagesService,
              private invoiceSvc: InvoiceService) { }

  	ngOnInit() {
  		this.user = JSON.parse(localStorage.getItem('user'));
      this.invoiceId = localStorage.getItem('faktura'); //      ??????? DA li je ovo tacno ???????
  	}

    getFakturu(invoiceId){
      this.invoiceSvc.getOutputInvoice(invoiceId).subscribe(reply => {
          if(reply.success){
            var invoice = reply.invoice;
            // Detalji
            this.purchaser = invoice.purchaser.toString();
            this.invNumber = invoice.invNumber.toString();
            this.issueDate = invoice.issueDate.toString();
            this.total = invoice.total.toString();
            // Artikli
            var newElement;
            invoice.items.forEach((input)=>{
              newElement = {
                name: invoice.items.name,
                quantity: invoice.items.quantity,
                code: invoice.items.code,
                sellingP: invoice.items.sellingP
              };
              this.Artikli.push(newElement);
            });
          }
          else{
            this.flashMessage.show(reply.msg, {cssClass: 'alert-danger', timeout: 3000});
            return false;
          }
        }, err => {
          console.log(err);
          return false;
        });
    }
}
