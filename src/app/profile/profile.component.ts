import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CardService } from '../services/card.service';
import { Observable } from 'rxjs';
import { Deck, DeckService } from '../services/deck.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  user$: Observable<any>;
  userDecks: Deck[] = [];

  constructor(
    private authService: AuthService,
    private cardService: CardService,
    private deckService: DeckService
  ) {
    this.user$ = this.authService.currentUser$;
  }

  ngOnInit() {
    this.loadUserDecks();
    this.user$.subscribe(user => {
      console.log('Current user:', user);
    });
    this.deckService.getUserDecks().subscribe(decks => {
      console.log('Deck data:', decks);
      this.userDecks = decks;
    });
  }

  loadUserDecks() {
  this.deckService.getUserDecks().subscribe({
    next: (decks) => {
      console.log('Loaded decks:', decks);
      this.userDecks = decks;
    },
      error: (error) => {
        console.error('Failed to load decks', error);
      }
    });
  }

  viewDeck(deckId: number) {
    // Implement deck viewing logic
  }

  editDeck(deckId: number) {
    // Implement deck editing logic
  }

  deleteDeck(deckId: number): void {
    this.cardService.deleteDeck(deckId).subscribe(() => {
      this.loadUserDecks();
    });
  }
}