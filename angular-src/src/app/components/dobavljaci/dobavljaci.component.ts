import { Component, OnInit, AfterViewInit, ElementRef} from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { SupplierService } from '../../services/redis/supplier.service';

declare var $: any;

@Component({
  selector: 'app-dobavljaci',
  templateUrl: './dobavljaci.component.html',
  styleUrls: ['./dobavljaci.component.css']
})
export class DobavljaciComponent implements OnInit, AfterViewInit {
	// Referenca na korisnika
	user: any;
	// Modal
	addModal: any;
	// Niz sa dobavljacima
	suppliers = [];
	// Err flags
	errorName = false;
	errorTaxId = false;
	// Onemoguci submit
	submited = false;

	constructor(public flashMessage: FlashMessagesService,
				public supplierSvc: SupplierService,
				public elRef: ElementRef) { }

	// Lifecycle hooks
	ngOnInit() {
		this.user = JSON.parse(localStorage.getItem('user'));
		// TABLE INIT
		this.getSuppliers();
	}

	ngAfterViewInit(){
		// Modal za dodavanje
		this.addModal = $(this.elRef.nativeElement).find('#add-supplier-modal');
	}

	// Error handle metode
	resetErrorFlags(){
		this.errorName = false;
		this.errorTaxId = false;
		// Omoguci ponovni submit
		this.submited = false;
	}

	// Metode za tabelu
	getSuppliers(){
		this.supplierSvc.getSuppliers(this.user.username).subscribe(reply => {
			if(reply.success){
				this.suppliers = reply.suppliers;
			}
			else
				return false;
		}, err => {
			console.log(err);
			return false;
		});
	}

	deleteSupplier(supplierName){
		this.supplierSvc.deleteSupplier(this.user.username, supplierName).subscribe(reply => {
			if(reply.success){
				this.flashMessage.show(reply.msg, {cssClass: 'alert-success', timeout: 2000});
				// Ozvezi tabelu
				for(var i=0; i<this.suppliers.length; i++)
					if(this.suppliers[i].name == supplierName)
						this.suppliers.splice(i,1);
			}
			else{
				this.flashMessage.show(reply.msg, {cssClass: 'alert-danger', timeout: 2000});
				return false;
			}
		}, err => {
			console.log(err);
			return false;
		});
	}

	addSupplier(supplierName, taxId){
		if(this.submited)
			return false;
		this.submited = true;
		// Error handle
		if(!supplierName){
			this.errorName = true; 
			this.submited = false; // Omoguci ponovni submit
			return false;
		}
		else{
			this.errorName = false;
		}
		if(!taxId){
			this.errorTaxId = true;
			this.submited = false; // Omoguci ponovni submit
			return false;
		}
		else{
			this.errorTaxId = false;
		}
		// Pakovanje
		var newSupplier = {
			name: supplierName,
			taxId: taxId
		};
		// Turn off modal
		this.addModal.modal('hide');

		this.supplierSvc.addSupplier(this.user.username, newSupplier).subscribe(reply => {
			// Handle reply
			if(reply.success){
				// Osvezi tabelu
				this.supplierSvc.getSupplier(this.user.username, newSupplier.name).subscribe(reply => {
					// Handle reply
					if(reply.success){
						this.suppliers.unshift(reply.supplier);
					}
					else
						return false;
				}, err => {
					console.log(err);
					return false;
				});
				// Poruka
				this.flashMessage.show(reply.msg, {cssClass: 'alert-success', timeout: 2000});
			}
			else{
				this.flashMessage.show(reply.msg, {cssClass: 'alert-danger', timeout: 2000});
				return false;
			}
		}, err => {
			console.log(err);
			return false;
		});
	}
}