import { AfterViewInit, Component, computed, inject, signal } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonButtons,
  IonButton,
} from '@ionic/angular/standalone';
import { NavigationService } from '../services/navigation.service';
import { OutletService } from '../services/outlet.service';

interface Card {
  id: number;
  title: string;
}

@Component({
  selector: 'app-switch',
  templateUrl: 'switch.page.html',
  styleUrls: ['switch.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonButtons,
    IonButton,
  ],
})
export class SwitchPage implements AfterViewInit {
  private readonly navigationService = inject(NavigationService);
  private readonly outletService = inject(OutletService);

  protected readonly activeOutletIndex = this.outletService.activeOutletIndex;
  protected readonly currentIndex = signal(0);

  protected readonly showCloseButton = computed(() => {
    return this.activeOutletIndex() === undefined;
  });

  // Sample cards - you can replace this with your actual data
  protected readonly cards: Card[] = [
    { id: 1, title: 'Card 1' },
    { id: 2, title: 'Card 2' },
    { id: 3, title: 'Card 3' },
    { id: 4, title: 'Card 4' },
  ];

  private isDragging = false;
  private startX = 0;
  private currentX = 0;
  private carouselElement: HTMLElement | null = null;

  constructor() {
    this.outletService.activeOutletIndex.set(
      this.navigationService.outletIndex,
    );
  }

  public ngAfterViewInit(): void {
    this.carouselElement = document.querySelector('.carousel-container');
    if (this.carouselElement) {
      this.setupTouchHandlers();
    }
  }

  private setupTouchHandlers(): void {
    if (!this.carouselElement) return;

    this.carouselElement.addEventListener('touchstart', (e) => {
      this.isDragging = true;
      this.startX = e.touches[0].clientY; // Use clientY for vertical swiping
    }, { passive: false });

    this.carouselElement.addEventListener('touchmove', (e) => {
      if (!this.isDragging) return;
      e.preventDefault();
      this.currentX = e.touches[0].clientY;
      this.updateCarouselPosition();
    }, { passive: false });

    this.carouselElement.addEventListener('touchend', () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.snapToCard();
    }, { passive: false });

    // Mouse events for desktop (wheel for vertical scrolling)
    this.carouselElement.addEventListener('wheel', (e) => {
      e.preventDefault();
      const threshold = 30;
      const delta = e.deltaY;

      if (Math.abs(delta) > threshold) {
        if (delta > 0 && this.currentIndex() > 0) {
          // Scroll down - go to previous card
          this.currentIndex.set(this.currentIndex() - 1);
        } else if (delta < 0 && this.currentIndex() < this.cards.length - 1) {
          // Scroll up - go to next card
          this.currentIndex.set(this.currentIndex() + 1);
        }
      }
    }, { passive: false });
  }

  private updateCarouselPosition(): void {
    if (!this.carouselElement) return;
    const deltaY = this.currentX - this.startX;
    const threshold = 50; // Minimum swipe distance

    // Calculate potential new index
    let newIndex = this.currentIndex();
    if (Math.abs(deltaY) > threshold) {
      if (deltaY > 0 && this.currentIndex() > 0) {
        // Swipe down - go to previous card
        newIndex = this.currentIndex() - 1;
      } else if (deltaY < 0 && this.currentIndex() < this.cards.length - 1) {
        // Swipe up - go to next card
        newIndex = this.currentIndex() + 1;
      }
    }

    // Only update if we're at boundaries or have enough movement
    if (newIndex !== this.currentIndex()) {
      this.currentIndex.set(newIndex);
      this.startX = this.currentX;
    }
  }

  private snapToCard(): void {
    // Reset any temporary transform
    if (this.carouselElement) {
      this.carouselElement.style.transform = '';
    }
  }

  protected onCardClick(card: Card): void {
    this.navigationService.navigateToNewContext(['trading', 'tabs', 'home']);
  }

  protected getCardStyle(index: number): { [key: string]: string } {
    const currentIdx = this.currentIndex();
    const offset = index - currentIdx;
    const absOffset = Math.abs(offset);

    // Calculate scale and translate based on position
    // Cards behind get smaller and move down
    const scale = Math.max(0.65, 1 - absOffset * 0.12);
    const translateY = offset * 50; // Vertical offset for stacking
    const translateZ = -absOffset * 60; // Depth for 3D effect
    const opacity = Math.max(0.4, 1 - absOffset * 0.25);

    return {
      transform: `translate3d(0, ${translateY}px, ${translateZ}px) scale(${scale})`,
      opacity: opacity.toString(),
      zIndex: (this.cards.length - absOffset).toString(),
    };
  }

  protected onClose(): void {
    this.navigationService.navigateToNewContext(['trading', 'tabs', 'home']);
  }
}

