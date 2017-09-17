import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { DateService } from '../../services/date.service';
import { WarehouseService } from '../../services/redis/warehouse.service';
import { InvoiceService } from '../../services/neo4j/invoice.service';
import { DataService } from '../../services/data.service';

declare var $: any;

@Component({
  selector: 'app-izlazna-faktura',
  templateUrl: './izlazna-faktura.component.html',
  styleUrls: ['./izlazna-faktura.component.css']
})
export class IzlaznaFakturaComponent implements OnInit {
	// Reference
	user: any;
	invoiceId: any;
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
	addRowButton: any;
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
	invDetails = {};
	invRowData = [];
	// Input group
	nameView: any;
	invNumberView: any;
	issueDateView: any;
	nameEdit: any;
	invNumberEdit: any;
	issueDateEdit: any;

	constructor(private router: Router,
				private flashMessage: FlashMessagesService,
				private elRef: ElementRef,
				private dateSvc: DateService,
				private warehouseSvc: WarehouseService,
				private invoiceSvc: InvoiceService,
				private dataSvc: DataService) { }

  	ngOnInit() {
  		// INIT
  		this.user = JSON.parse(localStorage.getItem('user'));
  		this.invoiceId = localStorage.getItem('outputInvoice');
  		this.getInvoice();
  		// INPUT GROUP
  		this.nameView = $(this.elRef.nativeElement).find('#view-name');
  		this.invNumberView = $(this.elRef.nativeElement).find('#view-invNumber');
  		this.issueDateView = $(this.elRef.nativeElement).find('#view-issueDate');
  		this.nameEdit = $(this.elRef.nativeElement).find('#edit-name');
  		this.invNumberEdit = $(this.elRef.nativeElement).find('#edit-invNumber');
  		this.issueDateEdit = $(this.elRef.nativeElement).find('#edit-issueDate');
  		// DATE PLUG-IN INIT
  		this.issueDate = $(this.elRef.nativeElement).find('#edit-iDate');
	    this.issueDate.datepicker();
	    // ADD ROW BUTTON
	    this.addRowButton = document.getElementById('add-row-button');
  	}

  	switchMode(){
  		this.editMode = !this.editMode;
  		if(this.editMode){
  			this.rowData = JSON.parse(JSON.stringify(this.invRowData));
  			this.nameEdit.val(this.nameView.val());
  			this.invNumberEdit.val(this.invNumberView.val());
  			this.issueDateEdit.val(this.issueDateView.val());
  			this.sumInvoice();
  		}
  	}

  	// UNDO
  	undo(callback){
  		this.invoiceSvc.undoOutput(this.invoiceId).subscribe(reply => {
  			return callback(reply.success, reply.msg);
		}, err =>{
			console.log(err);
			return false;
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
  		this.invoiceSvc.getOutputInvoice(this.invoiceId).subscribe(reply => {
	      if(reply.success){
	      	this.invDetails = {
	      		purchaser: reply.invoice.purchaser,
	      		invNumber: reply.invoice.invNumber,
	      		issueDate: reply.invoice.issueDate,
	      		total: reply.invoice.total
	      	};
	      	if(reply.invoice.items)
	      		reply.invoice.items.forEach((item)=>{
	      			this.invRowData.unshift({
				      id: this.rowId,
				      showDropdown: false,
				      code: item.code,
				      name: item.name,
				      quantity: item.quantity,
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
				localStorage.removeItem('outputInvoice');
				this.router.navigate(['/izlaznefakture']);
			}
			else{
				this.flashMessage.show(msg, {cssClass: 'alert-danger', timeout: 3000});
				this.enableViewButtons();
				return false;
			}
		});
	}

	

  	// EDIT MODE METODE
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
		    	this.warehouseSvc.searchItem(this.user.username, encodeURIComponent(itemName)).subscribe(reply => {
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

	// Predaj fakturu
	submitInvoice(name, invNumber, issueDate){
		// Iskljuci 
		this.disableEditButtons();
		// Proveravanje gresaka
		var invDetails = {
	      purchaser: name,
	      invNum: invNumber,
	      issueDate: issueDate
	    };
	    if(!this.dataSvc.checkOutputInvoice(invDetails, this.rowData)){
	      this.enableEditButtons();
	      return false;
	    }
		// Pakovanje
		// Neo4j faktura
		var newInvoice = {
			purchaser: name,
			invNumber: invNumber,
			issueDate: this.dateSvc.reformatDate(issueDate),
			items: this.rowData,
			total: this.sum
		};
		// Ponistavanje stare
		this.undo((success, msg)=>{
			if(success){
				// Slanje nove
				this.invoiceSvc.addOutputInvoice(this.user.username, newInvoice).subscribe(reply => {
					if(reply.success){
						this.flashMessage.show(reply.msg, {cssClass: 'alert-success', timeout: 3000});
						// Izbaci stari id
						localStorage.removeItem('outputInvoice');
						this.router.navigate(['/izlaznefakture']);	
					}
					else{
						this.flashMessage.show(reply.msg, {cssClass: 'alert-danger', timeout: 3000});
						this.enableEditButtons();
						return false;
					}
				}, err => {
					console.log(err);
					return false;
				});
			}
			else{
				this.flashMessage.show(msg, {cssClass: 'alert-danger', timeout: 3000});
				this.enableEditButtons();
				return false;
			}
		});
	}

}
