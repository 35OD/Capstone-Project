import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  isPopupVisible = false;
  showPassword = false;
  isLogin = true;

  username: string = '';
  password: string = '';
  email: string = '';
  message: string = '';
  isSuccess: boolean = false;

  constructor(private authService: AuthService) {
    this.authService.showLogin$.subscribe(show => {
      this.isPopupVisible = show;
    });

      
  this.authService.isLogin$.subscribe(isLogin => {
    this.isLogin = isLogin;
  });
  }
  togglePopup() {
    this.isPopupVisible = !this.isPopupVisible;
  }

  closePopup() {
    this.isPopupVisible = false;
    this.authService.toggleLogin(false);
    this.authService.setIsLogin(true);
    this.username = '';
    this.password = '';
    this.email = '';
    this.message = '';
    this.showPassword = false;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleForm() {
    this.isLogin = !this.isLogin;
    this.username = '';
    this.password = '';
    this.email = '';
    this.message = '';
    this.showPassword = false;
  }

  onLogin() {
    if (!this.username || !this.password) {
      this.message = 'Please fill in both username and password.';
      this.isSuccess = false;
      return;
    }
    const credentials = { username: this.username, password: this.password };
    console.log('Sending credentials:', credentials);
    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login response:', response);
        this.message = 'Login successful';
        this.isSuccess = true;
        this.closePopup();
      },
      error: (error) => {
        console.error('Login error:', error);
        this.message = 'Login failed. Please check your credentials.';
        this.isSuccess = false;
      }
    });
  }

  onRegister() {
    if (!this.username || !this.password || !this.email) {
      this.message = 'Please fill in username, email, and password.';
      this.isSuccess = false;
      return;
    }
    const userData = { username: this.username, email: this.email, password: this.password };
    this.authService.register(userData).subscribe({
      next: (response) => {
        this.message = 'Registration successful';
        this.isSuccess = true;
        this.isLogin = true;
      },
      error: (error) => {
        this.message = 'Registration failed. Please try again.';
        this.isSuccess = false;
      }
    });
  }
}
