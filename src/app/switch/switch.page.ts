import { AfterViewInit, Component, computed, inject, OnDestroy, signal } from '@angular/core';
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
export class SwitchPage implements AfterViewInit, OnDestroy {
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
  private startY = 0;
  private currentY = 0;
  private carouselWrapper: HTMLElement | null = null;
  private carouselContainer: HTMLElement | null = null;
  private translateY = signal(0);
  private velocity = 0;
  private lastY = 0;
  private lastTime = 0;
  private animationFrameId: number | null = null;

  constructor() {
    this.outletService.activeOutletIndex.set(
      this.navigationService.outletIndex,
    );
  }

  public ngAfterViewInit(): void {
    this.carouselWrapper = document.querySelector('.carousel-wrapper');
    this.carouselContainer = document.querySelector('.carousel-container');
    if (this.carouselWrapper) {
      this.setupTouchHandlers();
    }
  }

  private setupTouchHandlers(): void {
    if (!this.carouselWrapper || !this.carouselContainer) return;

    this.carouselWrapper.addEventListener('touchstart', (e) => {
      this.isDragging = true;
      this.startY = e.touches[0].clientY;
      this.lastY = e.touches[0].clientY;
      this.lastTime = Date.now();
      this.velocity = 0;
      if (this.carouselContainer) {
        this.carouselContainer.style.transition = 'none';
      }
      this.stopMomentum();
    }, { passive: false });

    this.carouselWrapper.addEventListener('touchmove', (e) => {
      if (!this.isDragging) return;
      e.preventDefault();
      const currentTime = Date.now();
      const deltaTime = currentTime - this.lastTime;
      const deltaY = e.touches[0].clientY - this.lastY;
      
      if (deltaTime > 0) {
        this.velocity = deltaY / deltaTime;
      }
      
      this.currentY = e.touches[0].clientY;
      this.lastY = e.touches[0].clientY;
      this.lastTime = currentTime;
      this.updatePosition();
    }, { passive: false });

    this.carouselWrapper.addEventListener('touchend', () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.startMomentum();
    }, { passive: false });

    // Mouse events for desktop
    this.carouselWrapper.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.startY = e.clientY;
      this.lastY = e.clientY;
      this.lastTime = Date.now();
      this.velocity = 0;
      if (this.carouselContainer) {
        this.carouselContainer.style.transition = 'none';
      }
      this.stopMomentum();
    }, { passive: false });

    this.carouselWrapper.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      e.preventDefault();
      const currentTime = Date.now();
      const deltaTime = currentTime - this.lastTime;
      const deltaY = e.clientY - this.lastY;
      
      if (deltaTime > 0) {
        this.velocity = deltaY / deltaTime;
      }
      
      this.currentY = e.clientY;
      this.lastY = e.clientY;
      this.lastTime = currentTime;
      this.updatePosition();
    }, { passive: false });

    this.carouselWrapper.addEventListener('mouseup', () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.startMomentum();
    }, { passive: false });

    this.carouselWrapper.addEventListener('mouseleave', () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.startMomentum();
      }
    }, { passive: false });

    // Wheel events for desktop
    this.carouselWrapper.addEventListener('wheel', (e) => {
      e.preventDefault();
      const threshold = 30;
      const delta = e.deltaY;

      if (Math.abs(delta) > threshold) {
        const cardHeight = 450; // Card height + gap
        const newTranslateY = this.translateY() - delta * 0.5;
        this.translateY.set(newTranslateY);
        this.snapToCard();
      }
    }, { passive: false });
  }

  private updatePosition(): void {
    if (!this.carouselWrapper) return;
    const deltaY = this.currentY - this.startY;
    const cardHeight = 450; // Card height + gap
    let newTranslateY = this.translateY() + deltaY;
    
    // Calculate boundaries
    const minTranslateY = 0;
    const maxTranslateY = (this.cards.length - 1) * cardHeight;
    
    // Clamp to boundaries with resistance
    if (newTranslateY < minTranslateY) {
      newTranslateY = minTranslateY + (newTranslateY - minTranslateY) * 0.3;
    } else if (newTranslateY > maxTranslateY) {
      newTranslateY = maxTranslateY + (newTranslateY - maxTranslateY) * 0.3;
    }
    
    this.translateY.set(newTranslateY);
    this.startY = this.currentY;
    
    // Update current index based on position
    const newIndex = Math.round(newTranslateY / cardHeight);
    const clampedIndex = Math.max(0, Math.min(this.cards.length - 1, newIndex));
    if (clampedIndex !== this.currentIndex()) {
      this.currentIndex.set(clampedIndex);
    }
  }

  private startMomentum(): void {
    this.stopMomentum();
    
    const friction = 0.95;
    const minVelocity = 0.1;
    
    const animate = () => {
      if (Math.abs(this.velocity) < minVelocity) {
        this.velocity = 0;
        this.snapToCard();
        return;
      }
      
      const cardHeight = 450;
      let newTranslateY = this.translateY() - this.velocity * 10;
      
      // Calculate boundaries
      const minTranslateY = 0;
      const maxTranslateY = (this.cards.length - 1) * cardHeight;
      
      // Apply boundaries with bounce
      if (newTranslateY < minTranslateY) {
        newTranslateY = minTranslateY;
        this.velocity = 0;
        this.snapToCard();
        return;
      } else if (newTranslateY > maxTranslateY) {
        newTranslateY = maxTranslateY;
        this.velocity = 0;
        this.snapToCard();
        return;
      }
      
      this.translateY.set(newTranslateY);
      this.velocity *= friction;
      
      // Update current index
      const newIndex = Math.round(newTranslateY / cardHeight);
      const clampedIndex = Math.max(0, Math.min(this.cards.length - 1, newIndex));
      if (clampedIndex !== this.currentIndex()) {
        this.currentIndex.set(clampedIndex);
      }
      
      this.animationFrameId = requestAnimationFrame(animate);
    };
    
    this.animationFrameId = requestAnimationFrame(animate);
  }

  private stopMomentum(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.velocity = 0;
  }

  private snapToCard(): void {
    this.stopMomentum();
    
    if (this.carouselContainer) {
      this.carouselContainer.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    const cardHeight = 450;
    const targetTranslateY = this.currentIndex() * cardHeight;
    this.translateY.set(targetTranslateY);
  }

  protected onCardClick(card: Card): void {
    this.navigationService.navigateToNewContext(['trading', 'tabs', 'home']);
  }

  protected getCarouselStyle(): { [key: string]: string } {
    return {
      transform: `translateY(${-this.translateY()}px)`,
    };
  }

  protected getCardStyle(index: number): { [key: string]: string } {
    const cardHeight = 450; // Card height + gap
    const baseY = index * cardHeight;
    const currentY = this.translateY();
    const offset = baseY - currentY;
    const absOffset = Math.abs(offset);
    
    // Calculate scale and opacity based on distance from center
    // Cards closer to center (offset = 0) are larger and more opaque
    const maxDistance = cardHeight * 2;
    const normalizedDistance = Math.min(absOffset / maxDistance, 1);
    
    const scale = Math.max(0.6, 1 - normalizedDistance * 0.4);
    const opacity = Math.max(0.3, 1 - normalizedDistance * 0.7);
    
    // Calculate z-index - cards closer to center should be on top
    const zIndex = this.cards.length - Math.round(normalizedDistance * this.cards.length);

    return {
      transform: `translateX(-50%) translateY(${offset}px) scale(${scale})`,
      opacity: opacity.toString(),
      zIndex: zIndex.toString(),
    };
  }

  protected onClose(): void {
    this.navigationService.navigateToNewContext(['trading', 'tabs', 'home']);
  }

  public ngOnDestroy(): void {
    this.stopMomentum();
  }
}

