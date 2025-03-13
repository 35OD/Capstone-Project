import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private baseUrl = 'http://localhost:8080/api/test';

  constructor(private http: HttpClient) { }

  testConnection() {
    return this.http.get(`${this.baseUrl}/ping`, { responseType: 'text' });
  }
}