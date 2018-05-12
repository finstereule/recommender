import {Component, Input, OnInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {DemoService} from '../demo.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private _demoService: DemoService) { }

  public items;
  public id;
  public singleItem = {
    id: '',
    title: '',
    image: '',
    link: '',
    price: '',
    description: ''
  };

  ngOnInit() {
   this.route.params.subscribe(params => {this.id = (params.id); });
   this.getItems();
  }

  getItems() {
    this._demoService.getItems().subscribe(
      data => {
        this.items = data;
        this.items.forEach(element => {
          if (element.id === this.id) {
            this.singleItem = element;
          }
        });
      },
      err => console.error(err)
    );
  }

}
