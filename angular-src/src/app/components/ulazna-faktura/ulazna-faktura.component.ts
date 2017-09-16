import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { DateService } from '../../services/date.service';
import { WarehouseService } from '../../services/redis/warehouse.service';
import { SupplierService } from '../../services/redis/supplier.service';
import { InvoiceService } from '../../services/neo4j/invoice.service';

declare var $: any;

@Component({
  selector: 'app-ulazna-faktura',
  templateUrl: './ulazna-faktura.component.html',
  styleUrls: ['./ulazna-faktura.component.css']
})
export class UlaznaFakturaComponent implements OnInit {
	// Reference
	user: any;
	invoiceId: any;
	// Autocomplete predlozi
	suppliers = [];
	items = [];
	// Pretrazi ako se promeni zahtev
	// Pocetni zahtev za dobavljaca
	supplierName = "";
	itemName = "";
	// Autocomplete dropdown supplier
	supplierDropdown = false;
	supplierInput: any;
	taxIdInput: any;
	// Autocomplete dropdown item
	itemNameInput: any;
	// Autocomplete dropdown pokazivaci
	next = 0;
	prev = 0;
	// Redovi u tabeli
	rowData = [];
	rowId = 0;
	sum = 0;
	addRowButton: any;
	// Datumi
	recvDate: any;
	expDate: any;
	// Datumi
	issueDate: any;
	// Disabled
	undoButton = false;
	editButton = false;
	cancelButton = false;
	addItemButton = false;
	submitButton = false;
	// Rezim prikaza
	editMode = false;
	// Originalni podaci sa fakture
	invSupplier: any;
	invDetails = {};
	invRowData = [];
	// Input group view
	supplierView: any;
	taxIdView: any;
	refNumberView: any;
	invNumberView: any;
	recvDateView: any;
	expDateView: any;
	// Input group edit
	supplierEdit: any;
	taxIdEdit: any;
	refNumberEdit: any;
	invNumberEdit: any;
	recvDateEdit: any;
	expDateEdit: any;

	constructor(private router: Router,
				private flashMessage: FlashMessagesService,
				private elRef: ElementRef,
				private dateSvc: DateService,
				private supplierSvc: SupplierService,
				private warehouseSvc: WarehouseService,
				private invoiceSvc: InvoiceService) { }

	ngOnInit() {
		// INIT
  		this.user = JSON.parse(localStorage.getItem('user'));
  		this.invoiceId = localStorage.getItem('inputInvoice');
  		this.getInvoice();
  		// INPUT GROUP VIEW
  		this.supplierView = $(this.elRef.nativeElement).find('#view-supplier');
  		this.taxIdView = $(this.elRef.nativeElement).find('#view-taxId');
  		this.refNumberView = $(this.elRef.nativeElement).find('#view-refNum');
  		this.invNumberView = $(this.elRef.nativeElement).find('#view-invNum');
  		this.recvDateView = $(this.elRef.nativeElement).find('#view-recvDate');
  		this.expDateView = $(this.elRef.nativeElement).find('#view-expDate');
  		// INPUT GROUP EDIT
  		this.supplierEdit = $(this.elRef.nativeElement).find('#edit-supplier');
  		this.taxIdEdit = $(this.elRef.nativeElement).find('#edit-taxId');
  		this.refNumberEdit = $(this.elRef.nativeElement).find('#edit-refNum');
  		this.invNumberEdit = $(this.elRef.nativeElement).find('#edit-invNum');
  		this.recvDateEdit = $(this.elRef.nativeElement).find('#edit-recvDate');
  		this.expDateEdit = $(this.elRef.nativeElement).find('#edit-expDate');
  		// DROPDOWN
		this.supplierInput = this.supplierEdit;
		this.taxIdInput = this.taxIdEdit;
		// DATE PLUG-IN INIT
		this.recvDate = $(this.elRef.nativeElement).find('#edit-rDate');
		this.expDate = $(this.elRef.nativeElement).find('#edit-eDate');
		this.recvDate.datepicker();
		this.expDate.datepicker();
		// ADD ROW BUTTON
		this.addRowButton = document.getElementById('add-row-button');
	}

	switchMode(){
		this.editMode = !this.editMode;
		if(this.editMode){
  			this.rowData = JSON.parse(JSON.stringify(this.invRowData));
  			this.supplierEdit.val(this.supplierView.val());
	  		this.taxIdEdit.val(this.taxIdView.val());
	  		this.refNumberEdit.val(this.refNumberView.val());
	  		this.invNumberEdit.val(this.invNumberView.val());
	  		this.recvDateEdit.val(this.recvDateView.val());
	  		this.expDateEdit.val(this.expDateView.val());
  			this.sumInvoice();
  		}
	}

	// UNDO
	undoRedis(callback){
		this.supplierSvc.undoSupplier(this.user.username, this.invSupplier).subscribe(reply => {
			if(reply.success){
				// Pakovanje starih artikala
				var items = { items: this.invRowData };
				// Brisanje
				this.warehouseSvc.undoItems(this.user.username, items).subscribe(reply => {
					return callback(reply.success);
				}, err =>{
					console.log(err);
					return false;
				});
			}
			else
				return callback(false);
		}, err =>{
			console.log(err);
			return false;
		});
	}

  	undo(callback){
  		this.undoRedis((success)=>{
  			if(success)
  				this.invoiceSvc.undoInput(this.invoiceId).subscribe(reply => {
		  			return callback(reply.success, reply.msg);
				}, err =>{
					console.log(err);
					return false;
				});
  			else
  				callback(false, 'Ukidanje ulazne fakture neuspesno');
  		});
  	}


	// VIEW MODE METODE
  	enableViewButtons(){
		this.undoButton = false;
		this.editButton = false;
	}

	disableViewButtons(){
		this.undoButton = true;
		this.editButton = true;
	}

  	getInvoice(){
  		this.invoiceSvc.getInputInvoice(this.invoiceId).subscribe(reply => {
	      if(reply.success){
	      	this.invSupplier = reply.invoice.supplier;
	      	this.invDetails = {
	      		supplier: reply.invoice.supplier,
	      		taxId: reply.invoice.taxId,
		        refNumber: reply.invoice.refNumber,
		        invNumber: reply.invoice.invNumber,
		        recvDate: reply.invoice.recvDate,
		        expDate: reply.invoice.expDate,
		        total: reply.invoice.total,
	      	};
	      	if(reply.invoice.items)
	      		reply.invoice.items.forEach((item)=>{
	      			this.invRowData.unshift({
				      id: this.rowId,
				      showDropdown: false,
				      code: item.code,
				      name: item.name,
				      quantity: item.quantity,
				      purchaseP: item.purchaseP,
				      sellingP: item.sellingP
				    });
				    this.rowId++;
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

  	// Ponisti fakturu
	undoInvoice(){
		this.disableViewButtons();
		this.undo((success, msg)=>{
			if(success){
				this.flashMessage.show(msg, {cssClass: 'alert-success', timeout: 3000});
				// Local storage
				localStorage.removeItem('inputInvoice');
				this.router.navigate(['/ulaznefakture']);
			}
			else{
				this.flashMessage.show(msg, {cssClass: 'alert-danger', timeout: 3000});
				this.enableViewButtons();
				return false;
			}
		});
	}

	//EDIT MODE METODE
	enableEditButtons(){
  		this.cancelButton = false;
		this.addItemButton = false;
		this.submitButton = false;
  	}

  	disableEditButtons(){
  		this.cancelButton = true;
		this.addItemButton = true;
		this.submitButton = true;
  	}

	// Metode za dropdown
	// Supplier
	showSupplierDropdown(){
		this.supplierDropdown = true;
	}
	hideSupplierDropdown(){
		this.suppliers = [];
		this.supplierDropdown = false;
	}
	selectSupplier(supplier){
		// Dobavi pib
		this.supplierSvc.getSupplier(this.user.username, encodeURIComponent(supplier)).subscribe(reply => {
			if(reply.success){
				this.taxIdInput.val(reply.supplier.taxId);
				this.supplierInput.val(supplier);
				this.supplierDropdown = false;
			}
		}, err => {
			console.log(err);
			return false;
		});
	}
	// Item
	showItemDropdown(rowId){
		for(var i=0; i<this.rowData.length; i++)
			if(this.rowData[i].id == rowId)
				this.rowData[i].showDropdown = true;
	}
	hideItemDropdown(rowId){
		this.items = [];
		this.itemName = "";
		for(var i=0; i<this.rowData.length; i++)
			if(this.rowData[i].id == rowId)
				this.rowData[i].showDropdown = false;
	}
	selectItem(item, rowId){
		// Dobavi detalje
		this.warehouseSvc.getItemName(this.user.username, encodeURIComponent(item)).subscribe(reply => {
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
	// Nadji dobavljaca
	searchSupplier(supplierName, event){
		if(this.supplierName != supplierName){
			if(supplierName){
				this.supplierName = supplierName; // Novi zahtev
				this.supplierSvc.searchSupplier(this.user.username, encodeURIComponent(supplierName)).subscribe(reply => {
					if(reply.success){
						this.suppliers = reply.suggestion.slice(0,4);
						if (reply.suggestion.length > 0)
							this.showSupplierDropdown();
						else
							this.hideSupplierDropdown();
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
				this.supplierName = supplierName;
				this.hideSupplierDropdown();
			}
		}
		else{
			var supplierDropdownEl = $(this.elRef.nativeElement).find('#suppliers-dropdown').children();
			if((event.key == "ArrowDown") && (this.next != supplierDropdownEl.length)){
				if(this.next == this.prev){
					$(supplierDropdownEl[this.prev]).addClass('selected');
					this.next++;
				}
				else{
					$(supplierDropdownEl[this.prev]).removeClass('selected');
					$(supplierDropdownEl[this.next]).addClass('selected');
					this.prev++;
					this.next++;
				}
			}
			else if((event.key == "ArrowUp") && (this.prev != 0)){
				this.prev--;
				this.next--;
				$(supplierDropdownEl[this.next]).removeClass('selected');
				$(supplierDropdownEl[this.prev]).addClass('selected');
			}
			else if((event.key == "Enter") && supplierName){
				var selectedName = $(supplierDropdownEl[this.prev]).text();
				// Dobavi pib
				this.supplierSvc.getSupplier(this.user.username, encodeURIComponent(selectedName)).subscribe(reply => {
					if(reply.success){
						this.taxIdInput.val(reply.supplier.taxId);
						// Dodaj u input
						this.supplierInput.val(selectedName);
						this.hideSupplierDropdown();
					}
				}, err => {
					console.log(err);
					return false;
				});
			}
		}
	}

	// Nadji artikal
	searchItem(itemName, rowId, event){
		if(this.itemName != itemName){
			if(itemName){
				this.itemName = itemName; // Novi zahtev
				this.warehouseSvc.searchItem(this.user.username, encodeURIComponent(itemName)).subscribe(reply => {
					if(reply.success){
						this.items = reply.suggestion.slice(0,4);
						if (reply.suggestion.length > 0)
							this.showItemDropdown(rowId);
						else
							this.hideItemDropdown(rowId);
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
				this.hideItemDropdown(rowId);
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
				this.warehouseSvc.getItemName(this.user.username, encodeURIComponent(selectedItem)).subscribe(reply => {
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
	submitInvoice(supplierName, taxId, refNum, invNum, recvDate, expDate){
		this.disableEditButtons();
		// Proveravanje gresaka
		if(!supplierName || !taxId || !refNum || !invNum || !recvDate || !expDate ){
			this.flashMessage.show('Popunjavanje detalja neispravno', {cssClass: 'alert-success', timeout: 3000});
			this.enableEditButtons();
			return false;
		}
		for(var i=0; i<this.rowData.length; i++){
			if( !this.rowData[i].name || 
				!this.rowData[i].code || isNaN(this.rowData[i].code) || 
				!this.rowData[i].quantity || isNaN(this.rowData[i].quantity) || 
				!this.rowData[i].purchaseP || isNaN(this.rowData[i].purchaseP) || 
				!this.rowData[i].sellingP || isNaN(this.rowData[i].sellingP) )
			{
				this.flashMessage.show('Popunjavanje artikala neispravno', {cssClass: 'alert-danger', timeout: 3000});
				this.enableEditButtons();
				return false;
			}
			// reformat if no error
			else{
				this.rowData[i].code = parseInt(this.rowData[i].code);
				this.rowData[i].quantity = parseInt(this.rowData[i].quantity);
				this.rowData[i].purchaseP = parseInt(this.rowData[i].purchaseP);
				this.rowData[i].sellingP = parseInt(this.rowData[i].sellingP);
			}
		}
		// Pakovanje
		// Neo4j faktura
		var newInvoice = {
			supplier: supplierName,
		    taxId: taxId,
		    refNumber: refNum,
		    invNumber: invNum,
		    recvDate: this.dateSvc.reformatDate(recvDate),
		    expDate: this.dateSvc.reformatDate(expDate),
		    items: this.rowData,
		    total: this.sum
		};
		// Redis dobavljac
		var newSupplier = {
		    name: supplierName,
		    taxId: taxId
		};
		// Redis skladiste
		var newItems = {
			items: this.rowData
		};
		// Ponistavanje stare
		this.undo((success, msg)=>{
			if(success){
				// Slanje nove
				this.sendToRedis(newSupplier, newItems, (success)=>{
					if(success)
						this.sendToNeo(newInvoice);
					else{
						this.enableEditButtons();
						return false;
					}
				});
			}
			else{
				this.flashMessage.show(msg, {cssClass: 'alert-danger', timeout: 3000});
				this.enableEditButtons();
				return false;
			}
		});
	}

	sendToRedis(newSupplier, newItems, callback){
		this.supplierSvc.invAddSupplier(this.user.username, newSupplier).subscribe(reply =>{
			if(reply.success){
				this.warehouseSvc.addItems(this.user.username, newItems).subscribe(reply =>{
					return callback(reply.success);
				},err=>{
					console.log(err);
					return callback(false);
				});
			}
			else
				return callback(false);
		},err=>{
			console.log(err);
			return callback(false);
		});
	}

	sendToNeo(newInvoice){
		this.invoiceSvc.addInputInvoice(this.user.username, newInvoice).subscribe(reply => {
			if(reply.success){
				this.flashMessage.show(reply.msg, {cssClass: 'alert-success', timeout: 3000});
				// Izbaci stari id
				localStorage.removeItem('inputInvoice');
				this.router.navigate(['/ulaznefakture']);	
			}
			else{
				this.enableEditButtons();
				this.flashMessage.show(reply.msg, {cssClass: 'alert-danger', timeout: 3000});
				return false;
			}
		}, err => {
			this.enableEditButtons();
			console.log(err);
			return false;
		});
	}

}
