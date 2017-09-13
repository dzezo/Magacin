import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { SupplierService } from '../../services/redis/supplier.service';
import { WarehouseService } from '../../services/redis/warehouse.service';
import { InvoiceService } from '../../services/neo4j/invoice.service';

@Component({
  selector: 'app-fakture',
  templateUrl: './ulaznefakture.component.html',
  styleUrls: ['./ulaznefakture.component.css']
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
        if(reply.success){
          // Undo supplier (redis)
          this.supplierSvc.undoSupplier(this.user.username, reply.invoice.supplier).subscribe(reply => {}, err =>{console.log(err);});
          // Undo warehouse (redis)
          reply.invoice.items.forEach((item)=>{
            this.warehouseSvc.undoItem(this.user.username, item.name).subscribe(reply => {}, err =>{console.log(err);});
          });
          // Undo input invoice (neo4j)
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
        }
        else{
          // Ukljuci link
          this.enableDelete(invoiceId);
          return false;
        }
    }, err => {
        // Ukljuci link
        this.enableDelete(invoiceId);
        console.log(err);
        return false;
    });
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