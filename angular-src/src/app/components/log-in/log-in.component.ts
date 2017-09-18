import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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

  constructor(
  			private authService: AuthService,
  			private router: Router) { }

  ngOnInit() {
  }

  onLoginSubmit(){
  	var user = {
  		username: this.username,
  		password: this.password
  	}

  	this.authService.authenticateUser(user).subscribe(data =>{
  		if(data.success){
  			this.authService.storeUserData(data.token, data.user);
  			this.router.navigate(['/magacin']);
  		}
  		else {
        this.errorMsg = data.msg;
        this.error = true;
  			this.router.navigate(['/login']);
  		}
  	});
  }
}
