import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private apiUrl = 'http://localhost:8080/api/cards';

  constructor(private http: HttpClient) { }

  getCards(): Observable<Card[]> {
    return this.http.get<Card[]>(this.apiUrl);
  }

  uploadCard(formData: FormData): Observable<Card> {
    return this.http.post<Card>(`${this.apiUrl}/upload`, formData);
  }

  saveDeck(deckData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/decks`, deckData);
  }

  getUserDecks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/decks/user`);
  }
  
}