import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItemService } from '../../services/neo4j/item.service';


@Component({
  selector: 'app-arhiva',
  templateUrl: './arhiva.component.html',
  styleUrls: ['./arhiva.component.css']
})
export class ArhivaComponent implements OnInit {

    // User
    user: any
    // Arrays
    arhArtikli: Array<any>;


  constructor(private router: Router,
              private itemSvc: ItemService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getArchItems();
  }

  	getArtikl (artiklId){
   	localStorage.setItem('artikl',artiklId);
  	this.router.navigate(['/artikl']);
    }

    getArchItems(){
      this.itemSvc.getArchItems(this.user.id).subscribe(archArtikli => {
        this.arhArtikli = archArtikli;
      }, err => {
        console.log(err);
        return false;
      });

    }

}
