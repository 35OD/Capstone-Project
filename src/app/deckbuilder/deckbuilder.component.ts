import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CardService } from '../services/card.service';
import { Card } from '../models/card.model';
import { AuthService } from '../services/auth.service';
import { DeckService } from '../services/deck.service';

@Component({
  selector: 'app-deckbuilder',
  imports: [CommonModule, FormsModule, RouterModule,],
  templateUrl: './deckbuilder.component.html',
  styleUrl: './deckbuilder.component.scss',
})
export class DeckbuilderComponent {
  deckStats = {
    totalCards: 0,

    heroes: 0,
    landscapes: 0,
    creatures: 0,
    spells: 0,
    buildings: 0,
    teamwork: 0,

    bluePlains: 0,
    cornfields: 0,
    uselessSwamp: 0,
    sandyLands: 0,
    niceLands: 0,
    icyLands: 0,
    rainbow: 0,
    lavaFlats: 0,
  };

  deck = {
    spells: [] as any[],
    buildings: [] as any[],
    creatures: [] as any[],
    landscapes: [] as any[],
    teamworks: [] as any[],
    hero: null as any,
  };

  searchTerm: string = '';
  searchResults: any[] = [];
  popupCard: Card | null = null;
  showLoginPrompt: boolean = false;
  showNamePrompt: boolean = false;
  deckName: string = '';

  constructor(
    private cardService: CardService,
    private authService: AuthService,
    private router: Router,
    private deckService: DeckService
  ) {}

  searchCards(): void {
    this.cardService.getCards().subscribe((cards) => {
      this.searchResults = cards
        .filter(card => card && card.name) 
        .filter((card) => card.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
    });
  }

  addCardToDeck(card: Card): void {
    const currentCount =
      this.deck.spells.length +
      this.deck.buildings.length +
      this.deck.creatures.length;
    if (card.type === 'Spell') {
      if (currentCount < 40) {
        this.deck.spells.push(card);
      }
    } else if (card.type === 'Building') {
      if (currentCount < 40) {
        this.deck.buildings.push(card);
      }
    } else if (card.type === 'Hero') {
      this.deck.hero = card;
    } else if (card.type === 'Creature') {
      if (currentCount < 40) {
        this.deck.creatures.push(card);
      }
    } else if (card.type === 'Teamwork') {
      if (currentCount < 40) {
        this.deck.creatures.push(card);
      }
    } else if (card.type === 'Landscape') {
      if (this.deck.landscapes.length < 4) {
        this.deck.landscapes.push(card);
      }
    }

    this.deckStats.totalCards =
      this.deck.spells.length +
      this.deck.buildings.length +
      this.deck.creatures.length +
      this.deck.teamworks.length +
      this.deck.landscapes.length +
      (this.deck.hero ? 1 : 0);
    this.deckStats.heroes = this.deck.hero ? 1 : 0;
    this.deckStats.creatures = this.deck.creatures.length;
    this.deckStats.spells = this.deck.spells.length;
    this.deckStats.buildings = this.deck.buildings.length;
    this.deckStats.landscapes = this.deck.landscapes.length;

    const totalLandscapeCards =
      this.deckStats.bluePlains +
      this.deckStats.cornfields +
      this.deckStats.uselessSwamp +
      this.deckStats.sandyLands +
      this.deckStats.niceLands +
      this.deckStats.icyLands +
      this.deckStats.rainbow +
      this.deckStats.lavaFlats;

    if (totalLandscapeCards >= 40) {
      return;
    }

    if (card.cardLandscape === 'Blue Plains') {
      this.deckStats.bluePlains++;
    } else if (card.cardLandscape === 'Cornfield') {
      this.deckStats.cornfields++;
    } else if (card.cardLandscape === 'Useless Swamp') {
      this.deckStats.uselessSwamp++;
    } else if (card.cardLandscape === 'SandyLands') {
      this.deckStats.sandyLands++;
    } else if (card.cardLandscape === 'NiceLands') {
      this.deckStats.niceLands++;
    } else if (card.cardLandscape === 'IcyLands') {
      this.deckStats.icyLands++;
    } else if (card.cardLandscape === 'Rainbow') {
      this.deckStats.rainbow++;
    } else if (card.cardLandscape === 'LavaFlats') {
      this.deckStats.lavaFlats++;
    }
    this.updateDeckStats();
  }

  removeCardFromDeck(card: any): void {
    if (card.type === 'Spell') {
      const index = this.deck.spells.findIndex((c) => c.id === card.id);
      if (index > -1) {
        this.deck.spells.splice(index, 1);
      }
    } else if (card.type === 'Building') {
      const index = this.deck.buildings.findIndex((c) => c.id === card.id);
      if (index > -1) {
        this.deck.buildings.splice(index, 1);
      }
    } else if (card.type === 'Hero') {
      if (this.deck.hero && this.deck.hero.id === card.id) {
        this.deck.hero = null;
      }
    } else if (card.type === 'Creature' || card.type === 'Teamwork') {
      const index = this.deck.creatures.findIndex((c) => c.id === card.id);
      if (index > -1) {
        this.deck.creatures.splice(index, 1);
      }
    } else if (card.type === 'Landscape') {
      const index = this.deck.landscapes.findIndex((c) => c.id === card.id);
      if (index > -1) {
        this.deck.landscapes.splice(index, 1);
      }
    }

    if (card.cardLandscape === 'Blue Plains') {
      this.deckStats.bluePlains--;
    } else if (card.cardLandscape === 'Cornfield') {
      this.deckStats.cornfields--;
    } else if (card.cardLandscape === 'Useless Swamp') {
      this.deckStats.uselessSwamp--;
    } else if (card.cardLandscape === 'SandyLands') {
      this.deckStats.sandyLands--;
    } else if (card.cardLandscape === 'NiceLands') {
      this.deckStats.niceLands--;
    } else if (card.cardLandscape === 'IcyLands') {
      this.deckStats.icyLands--;
    } else if (card.cardLandscape === 'Rainbow') {
      this.deckStats.rainbow--;
    } else if (card.cardLandscape === 'LavaFlats') {
      this.deckStats.lavaFlats--;
    }
    this.updateDeckStats();
  }

  updateDeckStats(): void {
    this.deckStats.totalCards =
      this.deck.spells.length +
      this.deck.buildings.length +
      this.deck.creatures.length +
      (this.deck.hero ? 1 : 0);
    this.deckStats.heroes = this.deck.hero ? 1 : 0;
    this.deckStats.creatures = this.deck.creatures.length;
    this.deckStats.spells = this.deck.spells.length;
    this.deckStats.buildings = this.deck.buildings.length;
    this.deckStats.landscapes = this.deck.landscapes.length;
  }

  clearDeck(): void {
    this.deck.spells = [];
    this.deck.buildings = [];
    this.deck.creatures = [];
    this.deck.hero = null;
    this.deck.landscapes = [];

    this.deckStats.bluePlains = 0;
    this.deckStats.cornfields = 0;
    this.deckStats.uselessSwamp = 0;
    this.deckStats.sandyLands = 0;
    this.deckStats.niceLands = 0;
    this.deckStats.icyLands = 0;
    this.deckStats.rainbow = 0;
    this.deckStats.lavaFlats = 0;

    this.updateDeckStats();
  }

  private generateDeckSummary(): string {
    let summary = 'Deck Summary:\n\n';
    summary += 'Spells:\n' + this.groupCards(this.deck.spells) + '\n\n';
    summary += 'Buildings:\n' + this.groupCards(this.deck.buildings) + '\n\n';
    summary +=
      'Creatures/Teamwork:\n' + this.groupCards(this.deck.creatures) + '\n\n';
    summary += 'Landscapes:\n' + this.groupCards(this.deck.landscapes) + '\n\n';
    if (this.deck.hero) {
      summary += 'Hero:\n' + this.deck.hero.name + '\n';
    } else {
      summary += 'Hero:\nNone\n';
    }
    return summary;
  }

  private groupCards(cards: Card[]): string {
    if (cards.length === 0) {
      return 'None';
    }
    const grouped: { [key: string]: number } = {};
    cards.forEach((card) => {
      grouped[card.name] = (grouped[card.name] || 0) + 1;
    });
    let output = '';
    Object.entries(grouped).forEach(([name, count]) => {
      output += `${name} x${count}\n`;
    });
    return output;
  }

  copyDeckSummary(): void {
    const summary = this.generateDeckSummary();
    navigator.clipboard
      .writeText(summary)
      .then(() => {
        console.log('Deck summary copied to clipboard!');
        alert('Deck summary copied to clipboard!');
      })
      .catch((error) => {
        console.error('Error copying deck summary:', error);
      });
  }

  openPopup(card: Card, event: Event): void {
    event.stopPropagation();
    this.popupCard = card;
  }

  closePopup(): void {
    this.popupCard = null;
  }

  saveDeck(): void {
    this.authService.currentUser$.subscribe(user => {
      if (!user) {
        this.showLoginPrompt = true;
      } else {
        this.showNamePrompt = true;
      }
    });
  }

  confirmSaveDeck(): void {
    if (this.deckName.trim()) {
      console.log('Starting deck save process with deck name:', this.deckName);
  
      const allCards = [
        this.deck.hero,
        ...this.deck.spells,
        ...this.deck.buildings,
        ...this.deck.creatures,
        ...this.deck.landscapes,
        ...this.deck.teamworks
      ].filter(card => card != null);

      console.log('All cards to send:', allCards);
      this.deckService.saveDeck(this.deckName, allCards).subscribe({
        next: (response) => {
          console.log('Deck saved successfully:', response);
          alert('Deck saved successfully!');
          this.showNamePrompt = false;
          this.deckName = '';
        },
        error: (error) => {
          console.error('Error saving deck:', error);
        }
      });
    }
  }

  deleteDeck(deckId: number) {
    this.deckService.deleteDeck(deckId).subscribe({
      next: () => {
        console.log('Deck deleted successfully');

      },
      error: (error) => {
        console.error('Error deleting deck:', error);

      }
    });
  }
  openLoginPopup(): void {
    this.showLoginPrompt = false;
    this.authService.toggleLogin(true); 
  }
}
