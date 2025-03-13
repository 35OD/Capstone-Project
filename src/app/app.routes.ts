import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CardPageComponent } from './card-page/card-page.component';
import { DeckbuilderComponent } from './deckbuilder/deckbuilder.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cards', component: CardPageComponent },
  { path: 'deckbuilder', component: DeckbuilderComponent },
  { path: 'profile', component: ProfileComponent },
];
