import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthenticationService} from './authentification.service';

@Injectable()
export class AuthGuardService  implements CanActivate {

  constructor(private auth: AuthenticationService, private router: Router) {}

  canActivate() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }

  canLike() {
    if (!this.auth.isLoggedIn()) {
      return 'Вибачте, проте Ви не авторизовані!';
    }
  }
}
