import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';

interface LoginResponse {
  username: string;
  userId: number;
  email: string;
  message: string;
  profilePicture: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private showLoginSource = new Subject<boolean>();
  showLogin$ = this.showLoginSource.asObservable();
  private loginUrl = 'http://localhost:8080/api/auth/login';
  private registerUrl = 'http://localhost:8080/api/auth/register';

  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  

  constructor(private http: HttpClient) {}

  toggleLogin(show: boolean) {
    this.showLoginSource.next(show);
  }

  private isLoginSource = new Subject<boolean>();
  isLogin$ = this.isLoginSource.asObservable();

  setIsLogin(isLogin: boolean) {
    this.isLoginSource.next(isLogin);
  }

  login(credentials: { username: string; password: string; }): Observable<string> {
    return this.http.post<string>(this.loginUrl, credentials, { 
      responseType: 'text' as 'json' 
    }).pipe(
      tap(response => {
        const parsedResponse = JSON.parse(response);
        localStorage.setItem('userId', parsedResponse.userId);
        
        const user = { 
          username: credentials.username,
          userId: parsedResponse.userId,
          email: '',
          message: response,
          profilePicture: ''
        };
        this.currentUserSubject.next(user);
      })
    );
  }
  
  register(userData: {
    username: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post<any>(this.registerUrl, userData);
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('token');
  }
}
