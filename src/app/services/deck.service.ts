import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Card } from '../models/card.model';
import { AuthService } from './auth.service';

export interface Deck {
  id: number;
  deckName: string;
  cards: any[];
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class DeckService {
  private apiUrl = 'http://localhost:8080/api/decks';

  constructor(private http: HttpClient, authService: AuthService) {}

  saveDeck(deckName: string, cards: any[]): Observable<Deck> {
    const userId = localStorage.getItem('userId');
    console.log('Saving deck with name:', deckName);
    console.log('User ID:', userId);
    console.log('Cards to save:', cards);
  
    const deckData = {
      deckName: deckName,
      user: {
        id: userId
      },
      cards: cards.map(card => ({ id: card.id }))
    };
  
    console.log('Formatted deck data:', deckData);
    return this.http.post<Deck>(`${this.apiUrl}`, deckData);
  }
  
  getUserDecks(): Observable<Deck[]> {
    const userId = localStorage.getItem('userId');
    return this.http.get<Deck[]>(`${this.apiUrl}/user/${userId}`);
  }

  createDeck(deckName: string): Observable<Deck> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<Deck>(`${this.apiUrl}`, { deckName: deckName }, { headers });
}

  addCardsToDeck(deckId: number, cards: any): Observable<Deck> {
    console.log('Adding cards to deck ID:', deckId);
    console.log('Cards data:', cards);
    return this.http.post<Deck>(`${this.apiUrl}/${deckId}/cards`, cards);
  }
}
