import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }

  validateEntries(user){
	  if(user.name == undefined || user.username == undefined || user.email == undefined || user.password == undefined){
	  	return 'Popunite sva polja!';
    }
	  else{
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(re.test(user.email))
        return 'OK';
      else
        return 'E-mail adresa nije validna!';
    }
  }

}
