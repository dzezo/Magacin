import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { InvoiceService } from '../../services/neo4j/invoice.service';

@Component({
  selector: 'app-izlazfakture',
  templateUrl: './izlaznefakture.component.html',
  styleUrls: ['./izlaznefakture.component.css']
})
export class IzlazneFaktureComponent implements OnInit {
  // Referenca na korisnika
  user: any;
  // Ulazne fakture
  // Svaka faktura u fakturama ima oblik
  /*
    {
      details: { faktura }
      active: bool
    }
  */
  invoices = [];

  constructor(private router: Router,
              private flashMessage: FlashMessagesService,
              private invoiceSvc: InvoiceService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getInvoices();

  }

  // Metode za tabelu
  // Dobavi fakture
  getInvoices(){
    this.invoiceSvc.getOutputInvoices(this.user.username).subscribe(reply => {
        if(reply.success){
          // Delete links
          for(var i=0; i<reply.invoices.length; i++){
            this.invoices.push({
              details: reply.invoices[i],
              active: true
            });
          }
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

  getInvoice (invoiceId){
    localStorage.setItem('outputInvoice', invoiceId);
  	this.router.navigate(['/izlaznafaktura']);
  }

  // Ponisti fakturu
  undoInvoice(invoiceId){
    // Iskljuci link
    this.disableDelete(invoiceId);
    this.invoiceSvc.undoOutput(invoiceId).subscribe(reply => {
      if(reply.success){
        // Update view
        for(var i=0; i<this.invoices.length; i++){
          if(this.invoices[i].details.id == invoiceId){
            this.invoices.splice(i,1);
          }
        }
        this.flashMessage.show(reply.msg, {cssClass: 'alert-success', timeout: 3000});
      }
      else{
        // Ukljuci link
        this.enableDelete(invoiceId);
        this.flashMessage.show(reply.msg, {cssClass: 'alert-danger', timeout: 3000});
        return false;
      }
    }, err =>{
      // Ukljuci link
      this.enableDelete(invoiceId);
      console.log(err);
      return false;
    });

    // Local storage
    localStorage.removeItem('outputInvoice');
  }

  // Ostale metode

  enableDelete(invoiceId){
    // Ukljuci link
    this.invoices.forEach((invoice)=>{
      if(invoice.details.id == invoiceId)
        invoice.active = true;
    });
  }

  disableDelete(invoiceId){
    // Iskljuci link
    this.invoices.forEach((invoice)=>{
      if(invoice.details.id == invoiceId)
        invoice.active = false;
    });
  }

}
