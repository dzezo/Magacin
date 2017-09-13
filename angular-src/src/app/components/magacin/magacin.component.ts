import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ItemService } from '../../services/neo4j/item.service';

declare var $: any;

@Component({
  selector: 'app-magacin',
  templateUrl: './magacin.component.html',
  styleUrls: ['./magacin.component.css']
})
export class MagacinComponent implements OnInit {
	// User
	user: any;
	artiklId: any;
	// Arrays
	artikli: Array<any>;
	// Edit modal
	editModal: any;	
	artiklSifra: String = "";
	artiklIme: String = "";
	// Placeholders
	ukupnoPoN: 0;
	ukupnoPoProd: 0;		

  constructor(private router: Router,
  			  private itemSvc: ItemService,
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
        }
        else return false;
      }, err => {
        console.log(err);
        return false;
      });
    }

    archiveArtikl(artiklId){
    	this.itemSvc.archiveItem(artiklId).subscribe(Response => {
    		if(Response.success){
    			for(var i=0; i<this.artikli.length;i++){
					if(this.artikli[i].id == artiklId)
						this.artikli.splice(i,1);
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
    }

    clickedItem(artiklID, sifra, ime){
		this.artiklId = artiklID;
		this.artiklIme = ime;
		this.artiklSifra = sifra;
	}

	updateArtikl(code, name){
		var update = {
			code: code,
			name: name			
		};
		this.itemSvc.updateItem(this.artiklId, update).subscribe(Response =>{
			if(Response.success){
				this.editModal.modal('hide');
				for(var i=0; i<this.artikli.length; i++){
					if(this.artikli[i].id == this.artiklId)
						this.artikli[i] = Response.item;
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
	}
}
