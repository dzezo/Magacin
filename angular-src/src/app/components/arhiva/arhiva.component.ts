import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-arhiva',
  templateUrl: './arhiva.component.html',
  styleUrls: ['./arhiva.component.css']
})
export class ArhivaComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  	getArtikl (artiklId){
   	localStorage.setItem('artikl',artiklId);
  	this.router.navigate(['/artikl']);
    }

}
