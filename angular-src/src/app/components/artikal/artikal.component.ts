import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ItemService } from '../../services/neo4j/item.service';

@Component({
  selector: 'app-artikal',
  templateUrl: './artikal.component.html',
  styleUrls: ['./artikal.component.css']
})
export class ArtikalComponent implements OnInit {
	// Reference
 	user: any;
 	itemId: any;
 	// Ulazne fakture
 	inputInvoices = [];
 	// Izlazne fakture
 	outputInvoices = [];
 	// Artikal
 	code: String;
 	name: String;
 	quantity: String;
 	purchaseP: String;
 	sellingP: String;

  	constructor(public router: Router,
              	public flashMessage: FlashMessagesService,
              	public itemSvc: ItemService) { }

	ngOnInit() {
		this.user = JSON.parse(localStorage.getItem('user'));
		this.itemId = localStorage.getItem('artikl');
		this.getItem(this.itemId);
	}

	getItem(itemId){
		this.itemSvc.getItem(itemId).subscribe(reply => {
	      if(reply.success){
	      	var item = reply.item;
	      	// Detalji
	      	this.code = item.details.code.toString();
	      	this.name = item.details.name;
	      	this.quantity = item.details.quantity.toString();
	      	this.purchaseP = item.details.purchaseP.toString();
	      	this.sellingP = item.details.sellingP.toString();
	      	// Ulaz
	      	var newElement;
	      	item.inputs.forEach((input)=>{
	      		newElement = {
	      			id: input.details.id,
	      			supplier: input.details.supplier,
	      			invNumber: input.details.invNumber,
	      			quantity: input.in.quantity,
	      			purchaseP: input.in.purchaseP,
	      			sellingP: input.in.sellingP
	      		};
	      		this.inputInvoices.push(newElement);
	      	});
	      	// Izlaz
	      	item.outputs.forEach((output)=>{
	      		newElement = {
	      			id: output.details.id,
	      			purchaser: output.details.purchaser,
	      			invNumber: output.details.invNumber,
	      			issueDate: output.details.issueDate,
	      			quantity: output.out.quantity,
	      			sellingP: output.out.sellingP
	      		};
	      		this.outputInvoices.push(newElement);
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

	getInputInvoice(invoiceId){
		localStorage.setItem('inputInvoice', invoiceId);
  		this.router.navigate(['/ulaznafaktura']);
	}

	getOutputInvoice(invoiceId){
		localStorage.setItem('outputInvoice', invoiceId);
  		this.router.navigate(['/izlaznafaktura']);
	}
}
