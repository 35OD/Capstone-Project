import { Component, HostListener, OnInit } from '@angular/core';
import { Card } from '../models/card.model';
import { CardService } from '../services/card.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-card-page',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './card-page.component.html',
  styleUrl: './card-page.component.scss',
})
export class CardPageComponent implements OnInit {
  cards: Card[] = [];
  filteredCards: any[] = [];
  searchTerm: string = '';
  searchedTerm: string = '';
  searchType: 'cards' | 'users' = 'cards';
  showScrollTop = false;
  popupCard: Card | null = null;

  constructor(
    private cardService: CardService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.searchTerm = params['search'] || '';
      this.searchedTerm = params['search'] || '';
      this.loadCards();
    });
  }

  loadCards(): void {
    this.cardService.getCards().subscribe((data) => {
      this.cards = data;
      this.filterCards();
    });
  }

  filterCards(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCards = this.cards;
      return;
    }
    const lowerCaseSearch = this.searchTerm.toLowerCase();
    this.filteredCards = this.cards.filter((card) =>
      (card.name ? card.name.toLowerCase() : '').includes(lowerCaseSearch)
    );
  }
  goToCards() {
    this.searchedTerm = this.searchTerm;
    this.router.navigate(['/cards'], {
      queryParams: { search: this.searchTerm },
    });
  }

  @HostListener('window:scroll', [])
    onWindowScroll() {
      this.showScrollTop = window.pageYOffset > 100;
    }
  
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }

    openPopup(card: Card, event: Event): void {
      event.stopPropagation(); 
      this.popupCard = card;
    }
  
    closePopup(): void {
      this.popupCard = null;
    }
}
