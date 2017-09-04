import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigacija',
  templateUrl: './navigacija.component.html',
  styleUrls: ['./navigacija.component.css']
})
export class NavigacijaComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

}
