import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { SupplierService } from '../../services/redis/supplier.service';
import { WarehouseService } from '../../services/redis/warehouse.service';
import { InvoiceService } from '../../services/neo4j/invoice.service';

@Component({
  selector: 'app-fakture',
  templateUrl: './ulazneFakture.component.html',
  styleUrls: ['./ulazneFakture.component.css']
})
export class UlazneFaktureComponent implements OnInit {
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
              private supplierSvc: SupplierService,
              private warehouseSvc: WarehouseService,
              private invoiceSvc: InvoiceService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getInvoices();
  }

  // Metode za tabelu
  // Dobavi fakture
  getInvoices(){
    this.invoiceSvc.getInputInvoices(this.user.username).subscribe(reply => {
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

  // Odi na fakturu
  getInvoice (invoiceId){
  	localStorage.setItem('inputInvoice', invoiceId);
  	this.router.navigate(['/ulaznafaktura'])
  }

  // Ponisti fakturu
  undoInvoice(invoiceId){
    // Iskljuci link
    this.disableDelete(invoiceId);
    // Dobavi detalje fakture
    this.invoiceSvc.getInputInvoice(invoiceId).subscribe(reply => {
        if(reply.success)
          this.undoRedis(reply.invoice.supplier, reply.invoice.items, (success)=>{
            if(success)
              this.undoNeo(invoiceId);
            else{
              // Ukljuci link
              this.enableDelete(invoiceId);
              return false;
            }
          });
    }, err => {
        // Ukljuci link
        this.enableDelete(invoiceId);
        console.log(err);
        return false;
    });

    // Local storage
    localStorage.removeItem('inputInvoice');
    localStorage.removeItem('artikl');
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

  undoRedis(supplierName, itemsArr, callback){
    this.supplierSvc.undoSupplier(this.user.username, supplierName).subscribe(reply => {
      if(reply.success){
        // Pakovanje 
        var items = { items: itemsArr };
        this.warehouseSvc.undoItems(this.user.username, items).subscribe(reply => {
          return callback(reply.success);
        }, err =>{
          console.log(err);
          return callback(false);
        });
      }
      else
        return callback(false);
    }, err =>{
      console.log(err);
      return callback(false);
    });
  }

  undoNeo(invoiceId){
    this.invoiceSvc.undoInput(invoiceId).subscribe(reply => {
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
  }

}