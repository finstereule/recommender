import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService, UserDetails, UserLike} from '../authentification.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css']
})
export class ItemCardComponent implements OnInit {

  @Input () item;
  details: UserDetails['_id'];
  data: UserLike = {
    itemId: '',
    itemTitle: '',
    itemImage: '',
    itemDescription: '',
    itemLink: '',
    itemPrice: '',
    userId: ''
  };

  constructor(public auth: AuthenticationService) { }

  ngOnInit() {

    this.auth.profile().subscribe(user => {
    this.details = user._id;

  }, (err) => {
    console.error(err);
  });

  }

  saveData() {
    this.data.itemId = this.item.id;
    this.data.itemTitle = this.item.title;
    this.data.itemImage = this.item.image;
    this.data.itemDescription = this.item.description;
    this.data.itemLink = this.item.link;
    this.data.itemPrice = this.item.price;
    this.data.userId = this.details;
    this.item.favourite = true;
   // console.log(this.data);
    this.auth.saveUserLike(this.data).subscribe(() => {}, (err) => {
      console.error(err);
    });
  }

  deleteData() {
    this.data.itemId = this.item.id;
    this.data.itemTitle = this.item.title;
    this.data.itemImage = this.item.image;
    this.data.itemDescription = this.item.description;
    this.data.userId = this.details;
    this.item.favourite = false;

    this.auth.deleteUserLike(this.data).subscribe(() => {}, (err) => {
      console.error(err);
    });
  }
}
