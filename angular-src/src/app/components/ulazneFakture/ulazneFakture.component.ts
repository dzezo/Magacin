import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fakture',
  templateUrl: './ulaznefakture.component.html',
  styleUrls: ['./ulaznefakture.component.css']
})
export class UlazneFaktureComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  getInputInvoice (inputInvoiceId){
  	localStorage.setItem('inputInvoice', inputInvoiceId);
  	this.router.navigate(['/ulaznafaktura'])
  }

}
