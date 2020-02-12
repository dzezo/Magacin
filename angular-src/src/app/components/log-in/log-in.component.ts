import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
	// ngModel
	username: String;
	password: String;

	// Error
	error: Boolean = false;
	errorMsg: String;

  submitLock: Boolean;

  constructor(
  			public authService: AuthService,
  			public router: Router) { }

  ngOnInit() {
  }

  onLoginSubmit(){
    if(this.submitLock) return;

    // Lock submit button
    this.submitLock = true;

  	var user = {
  		username: this.username,
  		password: this.password
  	}

  	this.authService.authenticateUser(user).subscribe(
    data =>{
  		if(data.success){
  			this.authService.storeUserData(data.token, data.user);
  			this.router.navigate(['/magacin']);
  		}
  		else {
        this.setErrorMessage(data.msg);
  			this.router.navigate(['/login']);
		  }

      // Unlock submit button
      this.submitLock = false;
	  },
    err => {
      // Error handle
      if(err.status === 503){
        this.setErrorMessage('Server je nedostupan, molimo sačekajte.');
        Observable.timer(60*1000).subscribe(()=>{
          this.setErrorMessage('Pokušajte ponovo.');

          // Unlock submit button
          this.submitLock = false;
        });
      }
      else{
        this.setErrorMessage('Ulaz trenutno nije moguć.');

        // Unlock submit button
        this.submitLock = false;
      }
    });
  }

  setErrorMessage(message: String){
    this.errorMsg = message;
    this.error = true;
  }
}
