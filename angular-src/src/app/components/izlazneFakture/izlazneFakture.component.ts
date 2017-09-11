import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-izlazfakture',
  templateUrl: './izlaznefakture.component.html',
  styleUrls: ['./izlaznefakture.component.css']
})
export class IzlazneFaktureComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  getOutputInvoice (outputInvoiceId){
   	localStorage.setItem('outputInvoice', outputInvoiceId);
  	this.router.navigate(['/izlaznafaktura']);
  }

}
