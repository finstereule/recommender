import { Component, OnInit } from '@angular/core';
import {AuthenticationService, UserDetails} from '../authentification.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  details: UserDetails = {
    _id: '',
    email: '',
    name: '',
    exp: 0,
    iat: 0
  };
  public items;
  public empty = false;

  constructor(private auth: AuthenticationService) {
  }

  ngOnInit() {
    this.auth.profile().subscribe(user => {
      this.details = user;
      this.auth.getRecommendations(this.details._id).subscribe( data => {
        this.items = data;
        this.items.forEach(function (val) {
          val.favourite = false;
        });
        console.log(this.items);
        if (this.items.length === 0) {
          this.empty = true;
          console.log('no data'); }
       // console.log(data);
      });
    }, (err) => {console.error(err); },
      () => {

      });
  }

}
