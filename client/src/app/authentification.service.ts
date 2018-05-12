import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import 'rxjs/add/operator/map';
import {catchError} from 'rxjs/operators';

export interface UserDetails {
  _id: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
}

export interface UserLike {
  itemId: string;
  itemTitle: string;
  itemImage: string;
  itemDescription: string;
  itemLink: string;
  itemPrice: string;
  userId: string;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  email?: string;
  password: string;
  name: string;
}

@Injectable()
export class AuthenticationService {
  private token: string;
  // private details: string;

  constructor(private http: HttpClient, private router: Router) {}

  private saveToken(token: string): void {
    localStorage.setItem('mean-token', token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  private request(method: 'post'|'get', type: 'login'|'register'|'profile', user?: TokenPayload): Observable<any> {
    let base;

    if (method === 'post') {
      base = this.http.post(`http://localhost:3000/${type}`, user);
    } else {
      base = this.http.get(`http://localhost:3000/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
    }

    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );

    return request;
  }

  public register(user: TokenPayload): Observable<any> {
    return this.request('post', 'register', user);
  }

  public login(user: TokenPayload): Observable<any> {
    return this.request('post', 'login', user);
  }

  public profile(): Observable<any> {
    return this.request('get', 'profile');
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('mean-token');
    this.router.navigateByUrl('/');
  }

  public saveUserLike(userLike: UserLike): Observable<any> {
    return this.http.post(`http://localhost:3000/saveLike`, userLike);
  }

  public getFavourites(details) {
    return this.http.get(`http://localhost:3000/favourites`, {params: {details: details}});
  }

  public getFavouriteIds(details) {
    return this.http.get(`http://localhost:3000/favouriteIds`, {params: {details: details}});
  }

  public getRecommendations(details) {
    return this.http.get(`http://localhost:3000/recommendations`, {params: {details: details}});
  }

  public deleteUserLike(userLike: UserLike): Observable<any> {
    return this.http.post(`http://localhost:3000/deleteLike`, userLike);
  }

  public getPopular(details) {
    return this.http.get(`http://localhost:3000/popular`, {params: {details: details}});
  }
}
