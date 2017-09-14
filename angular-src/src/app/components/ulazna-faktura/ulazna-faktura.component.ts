import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { InvoiceService } from '../../services/neo4j/invoice.service';

@Component({
  selector: 'app-ulazna-faktura',
  templateUrl: './ulazna-faktura.component.html',
  styleUrls: ['./ulazna-faktura.component.css']
})
export class UlaznaFakturaComponent implements OnInit {
	// Reference
 	user: any;
 	invoiceId: any;
 	// Arrays
 	Artikli = [];
 	// Faktura
 	refNumber: String;
 	invNumber: String;
 	taxId: String;
 	suplier: String;
 	recvDate: String;
 	expDate: String;
 	total: String;

	constructor(private router: Router,
	            private flashMessage: FlashMessagesService,
	            private invoiceSvc: InvoiceService) { }

	ngOnInit() {
		this.user = JSON.parse(localStorage.getItem('user'));
		this.invoiceId = localStorage.getItem('faktura'); //			??????? DA li je ovo tacno ???????
		this.getFakturu(this.invoiceId)
	}

	getFakturu(invoiceId){
		this.invoiceSvc.getInputInvoice(invoiceId).subscribe(reply => {
	      if(reply.success){
	      	var invoice = reply.invoice;
	      	// Detalji
	      	this.refNumber = invoice.refNumber.toString();
	      	this.invNumber = invoice.invNumber.toString();
	      	this.taxId = invoice.taxId.toString();
	      	this.suplier = invoice.suplier.toString();
	      	this.recvDate = invoice.recvDate.toString();
	      	this.expDate = invoice.expDate.toString();
	      	this.total = invoice.total.toString();
	      	// Artikli
	      	var newElement;
	      	invoice.items.forEach((input)=>{
	      		newElement = {
	      			name: invoice.items.name,
	      			quantity: invoice.items.quantity,
	      			code: invoice.items.code,
	      			purchaseP: invoice.items.purchaseP,
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
