import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {DemoService} from './demo.service';
import { ItemCardComponent } from './item-card/item-card.component';
import { ItemDetailsComponent } from './item-details/item-details.component';
import {RouterModule, Routes} from '@angular/router';
import { AllProductsComponent } from './all-products/all-products.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import {AuthGuardService} from './auth-guard.service';
import {AuthenticationService} from './authentification.service';
import { FavouritesComponent } from './favourites/favourites.component';
import {SearchPipe} from './search.pipe';
import { PopularComponent } from './popular/popular.component';

const appRoutes: Routes = [
  { path: 'item/:id', component: ItemDetailsComponent },
  { path: '', component: AllProductsComponent},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService]},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'favourites', component: FavouritesComponent}
  ];

@NgModule({
  declarations: [
    AppComponent,
    ItemCardComponent,
    ItemDetailsComponent,
    AllProductsComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    FavouritesComponent,
    SearchPipe,
    PopularComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    DemoService,
    AuthenticationService,
    AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
