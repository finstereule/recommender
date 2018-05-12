import { Component, OnInit } from '@angular/core';
import {AuthenticationService, UserDetails} from '../authentification.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent implements OnInit {

  public items;
  public empty = false;

  constructor(public auth: AuthenticationService) { }

  ngOnInit() {
    this.getFavs();
  }

  getFavs() {
    this.auth.profile().subscribe(user => {
      this.auth.getFavourites(user._id)
        .subscribe(
          data => {
            this.items = data;
            this.items.forEach(function (val) {
              val.favourite = true;
            });
            if (this.items.length === 0) {
              this.empty = true;
              console.log('no favs'); }
          },
          err => console.error(err),
          () => console.log('done loading items'));
    });
  }
}
