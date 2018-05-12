import {Component, OnInit} from '@angular/core';
import {DemoService} from './demo.service';
import {AuthenticationService} from './authentification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public auth: AuthenticationService) { }

reload() {
  window.location.reload();
}
}
