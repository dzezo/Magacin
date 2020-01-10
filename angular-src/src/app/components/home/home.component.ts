import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	name: String;
	username: String;
	email: String;
	password: String;

	// Error
	error: Boolean = false;
	errorMsg: String;

  constructor(public validateService: ValidateService,
  			  public authService: AuthService,
  			  public router: Router) { }

  ngOnInit() {
  }

  onRegisterSubmit(){
		const user = {
			name: this.name,
			username: this.username,
			email: this.email,
			password: this.password
		}

		 // Required Fields
		if(!this.validateService.validateRegister(user)){
			this.error = true;
			this.errorMsg = 'Popunite sva polja!';
			return false;
		}

		// Validate Email
		if(!this.validateService.validateEmail(user.email)){
			this.error = true;
			this.errorMsg = 'E-mail adresa nije validna!';
			return false;
		}

		// Register User
		this.authService.registerUser(user).subscribe((data) => {
			if(data.success){
				this.router.navigate(['/login']);
			}
			else{
				this.error = true;
				this.errorMsg = data.msg;
				this.router.navigate(['']);
			}
		});
	}
}
