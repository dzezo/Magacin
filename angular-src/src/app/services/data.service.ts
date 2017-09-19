import { Injectable } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';

@Injectable()
export class DataService {

  constructor(private flashMessage: FlashMessagesService) { }

  // Ispituje da li ima duplikata medju artiklima
  private checkForDups(items){
  	for(var i=0; i<items.length-1; i++)
  		for(var j=i+1; j<items.length; j++)
  			if(items[i].code == items[j].code)
  				return "Greška u " + (i+1) + ". i " + (j+1) + ". redu! Artikli na istoj šifri";
  	return "";
  }

  // Ispitjue podatke na ulaznoj fakturi
  checkInputInvoice(details, items){
  	try{
      if(!items.length) throw "Greška! Faktura je prazna.";

  		if(!details.supplier) throw "Greška! Unesite dobavljača";
  		if(!details.taxId) throw "Greška! Unesite PIB";
  		if(!details.refNum) throw "Greška! Unesite poziv na broj";
  		if(!details.invNum) throw "Greška! Unesite broj fakture";
  		if(!details.recvDate) throw "Greška! Unesite datum dospeća";
  		if(!details.expDate) throw "Greška! Unesite datum isteka";

  		for(var i=0; i<items.length; i++){
  			if(!items[i].name) throw "Greška u " + (i+1) + ". redu! Artikal nema ime";
			else if(!items[i].code) throw "Greška u " + (i+1) + ". redu! Artikal nema šifru";
			else if(isNaN(items[i].code)) throw "Greška u " + (i+1) + ". redu! Šifra mora biti broj";
			else if(!items[i].quantity) throw "Greška u " + (i+1) + ". redu! Količina nije navedena";
			else if(isNaN(items[i].quantity)) throw "Greška u " + (i+1) + ". redu! Količina mora biti broj";		
			else if(!items[i].purchaseP) throw "Greška u " + (i+1) + ". redu! Nabavna cena nije navedena";
			else if(isNaN(items[i].purchaseP)) throw "Greška u " + (i+1) + ". redu! Nabavna cena mora biti broj";
			else if(!items[i].sellingP) throw "Greška u " + (i+1) + ". redu! Prodajna cena nije navedena";
			else if(isNaN(items[i].sellingP)) throw "Greška u " + (i+1) + ". redu! Prodajna cena mora biti broj";
			else{
				items[i].code = parseInt(items[i].code);
				items[i].quantity = parseInt(items[i].quantity);
				items[i].purchaseP = parseInt(items[i].purchaseP);
				items[i].sellingP = parseInt(items[i].sellingP);
			}
  		}

  		var dupError = this.checkForDups(items);
  		if(dupError)
  			throw dupError;

  		return true;
  	}
  	catch(err){
  		this.flashMessage.show(err, {cssClass: 'alert-danger', timeout: 3500});
  		return false;
  	}
  }

  // Ispituje podatke na izlaznoj fakturi
  checkOutputInvoice(details, items){
  	try{
      if(!items.length) throw "Greška! Faktura je prazna.";
      
  		if(!details.purchaser) throw "Greška! Unesite dobavljača";
  		if(!details.invNum) throw "Greška! Unesite broj fakture";
  		if(!details.issueDate) throw "Greška! Unesite datum dospeća";

  		for(var i=0; i<items.length; i++){
  			if(!items[i].name) throw "Greška u " + (i+1) + ". redu! Artikal nema ime";
			else if(!items[i].code) throw "Greška u " + (i+1) + ". redu! Artikal nema šifru";
			else if(isNaN(items[i].code)) throw "Greška u " + (i+1) + ". redu! Šifra mora biti broj";
			else if(!items[i].quantity) throw "Greška u " + (i+1) + ". redu! Količina nije navedena";
			else if(isNaN(items[i].quantity)) throw "Greška u " + (i+1) + ". redu! Količina mora biti broj";
			else if(!items[i].sellingP) throw "Greška u " + (i+1) + ". redu! Prodajna cena nije navedena";
			else if(isNaN(items[i].sellingP)) throw "Greška u " + (i+1) + ". redu! Prodajna cena mora biti broj";
			else{
				items[i].code = parseInt(items[i].code);
				items[i].quantity = parseInt(items[i].quantity);
				items[i].purchaseP = parseInt(items[i].purchaseP);
				items[i].sellingP = parseInt(items[i].sellingP);
			}
  		}

  		var dupError = this.checkForDups(items);
  		if(dupError)
  			throw dupError;

  		return true;
  	}
  	catch(err){
  		this.flashMessage.show(err, {cssClass: 'alert-danger', timeout: 3500});
  		return false;
  	}
  }

}
