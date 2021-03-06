import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { DateService } from '../../services/date.service';
import { WarehouseService } from '../../services/redis/warehouse.service';
import { InvoiceService } from '../../services/neo4j/invoice.service';
import { DataService } from '../../services/data.service';

declare var $: any;

@Component({
  selector: 'app-izlaz',
  templateUrl: './izlaz.component.html',
  styleUrls: ['./izlaz.component.css']
})
export class IzlazComponent implements OnInit {
  // Referenca na korisnika
  user: any;
  // Autocomplete predlozi
  items = [];
  // Pretrazi ako se promeni zahtev
  // Pocetni zahtev za artikal
  itemName = "";
  // Autocomplete dropdown item
  itemNameInput: any;
  active = null; // pomeraj aktivnog inputa
  // Autocomplete dropdown pokazivaci
  next = 0;
  prev = 0;
  // Redovi u tabeli
  rowData = [];
  rowId = 0;
  sum = 0;
  // Datumi
  issueDate: any;
  // Iskljuci submit dugme
  submited = false;
  addRowButton: any;

  constructor(public router: Router,
              public flashMessage: FlashMessagesService,
              public elRef: ElementRef,
              public dateSvc: DateService,
              public warehouseSvc: WarehouseService,
              public invoiceSvc: InvoiceService,
              public dataSvc: DataService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    // DATE PLUG-IN INIT
    this.issueDate = $(this.elRef.nativeElement).find('#purchaser-issueDate');
    this.issueDate.datepicker();
    // ADD ROW BUTTON
    this.addRowButton = document.getElementById('add-row-button');
  }

  // Metode za dropdown
  // Item
  showItemDropdown(rowId){
    // Ako postoji aktvni
    if(this.active){
      // Iskljuci stari
      this.rowData[this.active].showDropdown = false;
      // Ukljuci novi
      for(var i=0; i<this.rowData.length; i++)
        if(this.rowData[i].id == rowId){
          this.rowData[i].showDropdown = true;
          this.active = i;
        }
    }
    else{
      for(var i=0; i<this.rowData.length; i++)
        if(this.rowData[i].id == rowId){
          this.rowData[i].showDropdown = true;
          this.active = i;
        }
    }
  }
  hideItemDropdown(){
    // Ako postoji aktivni, onda iskljuci
    if(this.active !== null){
      this.items = [];
      this.itemName = "";
      this.rowData[this.active].showDropdown = false;
      this.active = null;
    }
  }

  selectItem(item, rowId){
    // Dobavi detalje
    this.warehouseSvc.getItemName(this.user.username, item).subscribe(reply => {
      if(reply.success){
        this.itemNameInput = $(this.elRef.nativeElement).find('#item-name-' + rowId);
        this.itemNameInput.val(reply.item.name);
        // Popuni red
        for(var i=0; i<this.rowData.length; i++){
          if(this.rowData[i].id == rowId){
            this.rowData[i].code = reply.item.code;
            this.rowData[i].name = reply.item.name;
            this.rowData[i].purchaseP = reply.item.purchaseP;
            this.rowData[i].sellingP = reply.item.sellingP;
            // iskljuci dropdown
            this.rowData[i].showDropdown = false;
          }
        }
      }
    }, err => {
      console.log(err);
      return false;
    });
  }

  // Metode za tabelu
  // Svaki red po kreiranju dobija id 
  addRow(id){
    this.addRowButton.scrollIntoView();
    this.rowData.push({
      id: id,
      showDropdown: false
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

  // Nadji artikal
  searchItem(itemName, rowId, event){
    if(this.itemName != itemName){
      if(itemName){
        this.itemName = itemName; // Novi zahtev
        this.warehouseSvc.searchItem(this.user.username, itemName).subscribe(reply => {
          if(reply.success){
            this.items = reply.suggestion.slice(0,4);
            if (reply.suggestion.length > 0)
              this.showItemDropdown(rowId);
            else
              this.hideItemDropdown();
            this.next = 0;
            this.prev = 0;
          }
        }, err => {
          console.log(err);
          return false;
        });
      }
      // prazno
      else{
        this.itemName = itemName;
        this.hideItemDropdown();
      }
    }
    else{
      var itemDropdownEl = $(this.elRef.nativeElement).find('#item-dropdown-' + rowId).children();
      if((event.key == "ArrowDown") && (this.next != itemDropdownEl.length)){
        if(this.next == this.prev){
          $(itemDropdownEl[this.prev]).addClass('selected');
          this.next++;
        }
        else{
          $(itemDropdownEl[this.prev]).removeClass('selected');
          $(itemDropdownEl[this.next]).addClass('selected');
          this.prev++;
          this.next++;
        }
      }
      else if((event.key == "ArrowUp") && (this.prev != 0)){
        this.prev--;
        this.next--;
        $(itemDropdownEl[this.next]).removeClass('selected');
        $(itemDropdownEl[this.prev]).addClass('selected');
      }
      else if((event.key == "Enter") && itemName){
        var selectedItem = $(itemDropdownEl[this.prev]).text();
        // Dobavi pib
        this.warehouseSvc.getItemName(this.user.username, selectedItem).subscribe(reply => {
          if(reply.success){
            // Dodaj u input
            this.itemNameInput = $(this.elRef.nativeElement).find('#item-name-' + rowId);
            this.itemNameInput.val(selectedItem);
            // Popuni red
            for(var i=0; i<this.rowData.length; i++){
              if(this.rowData[i].id == rowId){
                this.rowData[i].code = reply.item.code;
                this.rowData[i].name = reply.item.name;
                this.rowData[i].purchaseP = reply.item.purchaseP;
                this.rowData[i].sellingP = reply.item.sellingP;
                // iskljuci dropdown
                this.rowData[i].showDropdown = false;
              }
            }
          }
        }, err => {
          console.log(err);
          return false;
        });
      }
    }
  }

  // Dobavi artikal po kodu
  getItemByCode(code, rowId){
    if(! isNaN(code)){
      this.warehouseSvc.getItemCode(this.user.username, parseInt(code)).subscribe(reply => {
        if(reply.success && (reply.item != null)){
          for(var i=0; i<this.rowData.length; i++){
            if(this.rowData[i].id == rowId){
              this.rowData[i].code = reply.item.code;
              this.rowData[i].name = reply.item.name;
              this.rowData[i].purchaseP = reply.item.purchaseP;
              this.rowData[i].sellingP = reply.item.sellingP;
            }
          }
        }
      }, err => {
        console.log(err);
        return false;
      });
    }
  }

  // Predaj fakturu
  submitInvoice(name, invNum, issueDate){
    // Iskljuci dugme
    this.submited = true;
    // Proveravanje gresaka
    var invDetails = {
      purchaser: name,
      invNum: invNum,
      issueDate: issueDate
    };
    if(!this.dataSvc.checkOutputInvoice(invDetails, this.rowData)){
      // Ukljuci dugme za ponovni submit
      this.submited = false;
      return false;
    }
    // Pakovanje
    // Neo4j faktura
    var newInvoice = {
      purchaser: name,
      invNumber: invNum,
      issueDate: this.dateSvc.reformatDate(issueDate),
      items: this.rowData,
      total: this.sum
    };
    // Slanje
    this.invoiceSvc.addOutputInvoice(this.user.username, newInvoice).subscribe(reply => {
      if(reply.success){
        // Neo4j success
        this.flashMessage.show(reply.msg, {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['/izlaznefakture']);
      }
      else{
        this.flashMessage.show(reply.msg, {cssClass: 'alert-danger', timeout: 3000});
        // Ukljuci dugme za ponovni submit
        this.submited = false;
        return false;
      }
    }, err => {
      console.log(err);
      return false;
    });
  }
}