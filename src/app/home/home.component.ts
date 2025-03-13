import { Component, HostListener } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CardService } from '../services/card.service';
import { Card } from '../models/card.model';
import { FormsModule } from '@angular/forms';
import { TestService } from '../services/test.service';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  searchTerm: string = '';
  searchedTerm: string = '';
  searchResults: Card[] = [];
  connectionStatus = 'Checking connection...';

  videoUrl: SafeResourceUrl;
  searchType: 'cards' | 'users' = 'cards';
  showScrollTop = false;

  constructor(
    private sanitizer: DomSanitizer,
    private cardService: CardService,
    private testService: TestService,
    private http: HttpClient,
    private router: Router
  ) {

    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.youtube.com/embed/kf_hRDWbIRE'
    );
  }
  ngOnInit() {
    this.http
      .get('http://localhost:8080/api/test/ping', { responseType: 'text' })
      .subscribe({
        next: (response) => {
          this.connectionStatus = response;
          console.log('Connection successful:', response);
        },
        error: (error) => {
          this.connectionStatus = 'Connection failed';
          console.log('Connection error:', error);
        },
      });
  }

  goToCards() {
    this.searchedTerm = this.searchTerm;
    this.router.navigate(['/cards'], {
      queryParams: { search: this.searchTerm },
    });
  }

  scrollToContent() {
    const contentSection = document.querySelector('.featuredContent');
    contentSection?.scrollIntoView({ behavior: 'smooth' });
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
}
