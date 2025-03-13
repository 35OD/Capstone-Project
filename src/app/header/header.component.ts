import { Component, HostListener, ViewChild } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [LoginComponent, CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class HeaderComponent {
  @ViewChild(LoginComponent) loginComponent!: LoginComponent;
  isHelpMenuOpen = false;
  isToolsMenuOpen = false;
  isMenuOpen = false;

  username: string = '';

  constructor(private authService: AuthService) {

    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.username = user.username;
      } else {
        this.username = '';
      }
    });
  }

  openLoginPopup() {
    this.loginComponent.togglePopup();
  }
  toggleHelpMenu() {
    this.isHelpMenuOpen = !this.isHelpMenuOpen;
  }
  toggleToolsMenu() {
    this.isToolsMenuOpen = !this.isToolsMenuOpen;
  }
  onClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.dropdown')) {
      this.isHelpMenuOpen = false;
      this.isToolsMenuOpen = false;
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition =
      window.pageYOffset || document.documentElement.scrollTop;
    const header = document.querySelector('header');

    if (scrollPosition > 80) {
      header?.classList.add('hidden');
    } else {
      header?.classList.remove('hidden');
    }
  }

  logout(): void {
    this.authService.logout();
    this.username = '';
  }

  openLogin() {
    this.authService.toggleLogin(true);
  }

  openRegister() {
    this.authService.toggleLogin(true);
    this.authService.setIsLogin(false);
  }
}
