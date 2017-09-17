import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ItemService } from '../../services/neo4j/item.service';
import { WarehouseService } from '../../services/redis/warehouse.service';

declare var $: any;

@Component({
  selector: 'app-magacin',
  templateUrl: './magacin.component.html',
  styleUrls: ['./magacin.component.css']
})
export class MagacinComponent implements OnInit {
	// User
	user: any;	
	// Arrays
	artikli: Array<any>;
	// Edit modal
	editModal: any;	
	artiklId: any;
	artiklSifra: String = "";
	artiklIme: String = "";
	// Placeholders
	ukupnoPoN: number;
	ukupnoPoProd: number;		

  constructor(private router: Router,
  			  private itemSvc: ItemService,
  			  private warehouseSvc: WarehouseService,
  			  private elRef: ElementRef,
  			  private flashMessage: FlashMessagesService) { }

  ngOnInit() {
  	this.user = JSON.parse(localStorage.getItem('user'));
  	this.getItems();
  }

  ngAfterViewInit(){
  	this.editModal = $(this.elRef.nativeElement).find('#edit-artikl-modal');
  }

	getArtikl (artiklId){
	localStorage.setItem('artikl',artiklId);
	this.router.navigate(['/artikl']);
	}

	getItems(){
      this.itemSvc.getItems(this.user.username).subscribe(artikli => {
        if(artikli.success){
          this.artikli = artikli.items;
          // Azuriranje suma
          this.sum();
        }
        else return false;
      }, err => {
        console.log(err);
        return false;
      });
    }    

    archiveArtikl(artiklId, ime){
    	var ImeArtikla = ime;
    	this.warehouseSvc.sendToArchive(this.user.username, ImeArtikla).subscribe(reply => {
    		if(reply.success) {
    			// START Ugnjezden Neo4j
		    	this.itemSvc.archiveItem(artiklId).subscribe(Response => {
		    		if(Response.success){
		    			for(var i=0; i<this.artikli.length;i++){
							if(this.artikli[i].id == artiklId)
								this.artikli.splice(i,1);
								// Azuriranje suma
								this.sum();
						}
		    			this.flashMessage.show(Response.msg, {cssClass: 'alert-success', timeout: 2000});
		    		}
		    		else {
		    			this.flashMessage.show(Response.msg, {cssClass: 'alert-danger', timeout: 2000});
		    		}
		    	}, err => {
		    		console.log(err);
		    		return false;
		    	});
		    	// END Ugnjezden Neo4j
				console.log('Redis je prosao!');
	      		}
	      	else {
	      		console.log('Redis NIJE je prosao!');
	      		return false;
	      	}
      	}, err =>{
			console.log(err);
			return false;
      	});			
	}

	clickedItem(artiklID, sifra, ime){
		this.artiklId = artiklID;
		this.artiklIme = ime;
		this.artiklSifra = sifra;
	}

	updateArtikl(code, name){
		var newItem = {
			newCode: code,
			newName: name			
		};
		this.warehouseSvc.updateItem(this.user.username, this.artiklIme, newItem).subscribe(reply => {
	      	if(reply.success){
	      		// START Ugnjezden Neo4j
	      		this.itemSvc.updateItem(this.artiklId, newItem).subscribe(Response =>{
				if(Response.success){
					this.editModal.modal('hide');
					for(var i=0; i<this.artikli.length; i++){
						if(this.artikli[i].id == this.artiklId)
							this.artikli[i] = Response.item;
							// Azuriranje suma
							this.sum();
					}
					this.flashMessage.show(Response.msg, {cssClass: 'alert-success', timeout: 2000});
				}
				else {
					this.editModal.modal('hide');
					this.flashMessage.show(Response.msg, {cssClass: 'alert-danger', timeout: 2000});
			        return false;
				}
			}, err =>{
				console.log(err);
				return false;
			});
	      		// END Ugnjezden Neo4j
	      		console.log('Redis je prosao!');
	      		}
	      	else {
	      		console.log('Redis NIJE je prosao!');
	      		return false;
	      	}
      	}, err =>{
			console.log(err);
			return false;
      	});			
	}

	// Izracunavanje suma
	sum(){
		this.ukupnoPoN = 0;
		this.ukupnoPoProd = 0;
		for(var i=0; i<this.artikli.length; i++){
			var quantity = this.artikli[i].quantity;
			var purchaseP = this.artikli[i].purchaseP;
			var sellingP = this.artikli[i].sellingP;
			this.ukupnoPoProd += quantity * sellingP;
			this.ukupnoPoN += quantity * purchaseP;
		}
	}
}
