import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	// User
	name: String;
	username: String;
	email: String;
	password: String;

	// Error
	error: Boolean = false;
	errorMsg: String;

	submitLock: Boolean;

  constructor(public validateService: ValidateService,
  			  public authService: AuthService,
  			  public router: Router) { }

  ngOnInit() {
  }

	onRegisterSubmit(){
		if(this.submitLock) return;

		// Lock submit button
		this.submitLock = true;

		const user = {
			name: this.name,
			username: this.username,
			email: this.email,
			password: this.password
		}

		// Validate Entries
		let validationMsg = this.validateService.validateEntries(user);
		if(validationMsg !== 'OK'){
			this.error = true;
			this.errorMsg = validationMsg;
			// Unlock submit button
			this.submitLock = false;
		}
		// Register User
		else{
			this.authService.registerUser(user).subscribe(
			data => {
				// Data handle
				if(data.success){
					this.router.navigate(['/login']);
				}
				else{
					this.error = true;
					this.errorMsg = data.msg;
					this.router.navigate(['']);
				}

				// Unlock submit button
				this.submitLock = false;
			},
			err => {
				// Error handle
				if(err.status === 503){
					this.error = true;
					this.errorMsg = 'Server je nedostupan, molimo sačekajte.';
					Observable.timer(60*1000).subscribe(()=>{
						this.error = true;
						this.errorMsg = 'Pokušajte ponovo.';

						// Unlock submit button
						this.submitLock = false;
					});
				}
			});
		}

	}
}
