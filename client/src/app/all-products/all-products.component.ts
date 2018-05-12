import {Component, Input, OnInit} from '@angular/core';
import {DemoService} from '../demo.service';
import {AuthenticationService} from "../authentification.service";

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {

  public items;
  public favIds;
  searchStr = '';

  constructor(private _demoService: DemoService, public auth: AuthenticationService) { }

  ngOnInit() {
    this.getItems();
  }

  getItems() {
    this._demoService.getItems().subscribe(
      data => { this.items = data; },
      err => console.error(err),
      () => { this.getFavIds(); }
    );
  }

  getFavIds() {
    this.auth.profile().subscribe(user => {
      this.auth.getFavouriteIds(user._id)
        .subscribe(
          data => {
            this.favIds = data;
            this.addFavField(this.items, this.favIds);
          },
          err => console.error(err),
          () => console.log(this.favIds));
    });
  }

  addFavField(allItems, favs) {
    let favSimpleArray = [];
    favs.forEach(function(val) {
      favSimpleArray.push(val.id);
    })
    allItems.forEach(function (val) {
      if (favSimpleArray.includes(val.id)) {val.favourite = true; } else { val.favourite = false; }
    });
    return allItems;
  }
}
