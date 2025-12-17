import {
  AfterViewInit,
  Component,
  OnDestroy,
  computed,
  inject,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonButtons,
} from '@ionic/angular/standalone';
import { NavigationService } from '../services/navigation.service';
import { OutletService } from '../services/outlet.service';
import { slideUpAndDownTransition } from '../utils/animations';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';

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
    IonButtons,
    ButtonComponent,
    IconComponent,
  ],
})
export class SwitchPage implements AfterViewInit, OnDestroy {
  private readonly navigationService = inject(NavigationService);
  private readonly outletService = inject(OutletService);
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly activeOutletIndex = this.outletService.activeOutletIndex;

  @ViewChild('scrollableContainer', { read: ElementRef })
  private scrollableContainerRef?: ElementRef<HTMLElement>;

  private scrollListener?: () => void;
  private wheelListener?: (e: WheelEvent) => void;
  private rafId?: number;

  protected readonly showCloseButton = computed(() => {
    return this.activeOutletIndex() === undefined;
  });

  protected readonly cards: Card[] = [
    { id: 1, title: 'Card 1' },
    { id: 2, title: 'Card 2' },
    { id: 3, title: 'Card 3' },
    { id: 4, title: 'Card 4' },
    { id: 5, title: 'Card 5' },
    { id: 6, title: 'Card 6' },
    { id: 7, title: 'Card 7' },
    { id: 8, title: 'Card 8' },
  ];

  /** Styles for each card, index-aligned with `cards` */
  protected readonly cardStyles: Array<Record<string, string | number>> =
    this.cards.map(() => ({}));

  /** Height in px of the spacer that drives the scroll */
  protected spacerHeight = 0;

  // --- animation constants (tweak to taste) ---

  private readonly MAX_VISIBLE = 4;
  private readonly STEP = 120; // scroll px per “card step”
  private readonly DEPTH_PER_CARD = -90;
  private readonly Y_BASE = -150; // distance between front and 2nd card
  private readonly SPACING_DECAY = 0.65; // 0–1 → gaps shrink to the back
  private readonly SCALE_STEP = 0.1;

  private scrollTop = 0;

  // --------------------------------------------

  ngAfterViewInit(): void {
    const maxIndex = Math.max(0, this.cards.length - 1);
    this.spacerHeight = maxIndex * this.STEP;
    this.cdr.detectChanges();

    // Set initial layout - with reversed direction, need max scroll to show cards 1, 2, 3, 4
    const maxScroll = maxIndex * this.STEP;
    this.scrollTop = maxScroll;
    this.updateLayout();

    // Wait for DOM to update with spacer height
    setTimeout(() => {
      const element = this.scrollableContainerRef?.nativeElement;
      if (!element) {
        return;
      }

      // Set initial scroll position to show cards 1, 2, 3, 4 (at the bottom with reversed direction)
      element.scrollTop = maxScroll;
      this.scrollTop = maxScroll;

      // Check if element is actually scrollable
      const scrollHeight = element.scrollHeight;
      const clientHeight = element.clientHeight;
      const canScroll = scrollHeight > clientHeight;

      if (!canScroll) {
        return;
      }

      // Attach scroll listener - use native scroll events with requestAnimationFrame (like GSAP ScrollTrigger)
      // This batches updates for smooth performance on mobile
      this.scrollListener = () => {
        const scrollTop = element.scrollTop;

        // Cancel previous frame if pending
        if (this.rafId !== undefined) {
          cancelAnimationFrame(this.rafId);
        }

        // Batch updates using requestAnimationFrame for smooth performance
        this.rafId = requestAnimationFrame(() => {
          this.scrollTop = scrollTop;
          this.updateLayout();
          this.rafId = undefined;
        });
      };

      element.addEventListener('scroll', this.scrollListener, {
        passive: true,
      });

      // Handle wheel events (mouse wheel scrolling)
      this.wheelListener = (e: WheelEvent) => {
        e.preventDefault();
        const newScrollTop = element.scrollTop + e.deltaY; // Normal direction: add deltaY
        element.scrollTop = Math.max(
          0,
          Math.min(newScrollTop, element.scrollHeight - element.clientHeight),
        );
      };
      element.addEventListener('wheel', this.wheelListener, { passive: false });

      // Don't handle touch events manually - let native scrolling work (like GSAP ScrollTrigger)
      // Native scroll events will be captured by the scroll listener above
    }, 100);
  }

  ngOnDestroy(): void {
    // Cancel any pending animation frame
    if (this.rafId !== undefined) {
      cancelAnimationFrame(this.rafId);
    }

    const element = this.scrollableContainerRef?.nativeElement;
    if (element) {
      if (this.scrollListener) {
        element.removeEventListener('scroll', this.scrollListener);
      }
      if (this.wheelListener) {
        element.removeEventListener('wheel', this.wheelListener);
      }
    }
  }

  protected onCardClick(card: Card): void {
    this.navigationService.navigateToNewContext(['trading', 'tabs', 'home'], {
      animation: slideUpAndDownTransition,
    });
  }

  protected onClose(): void {
    // Implement whatever "close" should mean in your app
    this.navigationService.navigateBack(undefined, {
      animation: slideUpAndDownTransition,
    });
  }

  // --- layout logic ported from vanilla JS ------------------------

  private spacingForSlot(slot: number): number {
    // Now handles negative slots for forward movement (disappearing front card)
    // slot = 0: front card (about to disappear)
    // slot = 1: next card (becoming front)
    // slot < 0: card moving forward (disappearing)
    // slot > 1: cards behind
    if (slot <= 0) {
      // For negative slots (forward movement), use reverse of the pattern
      const absSlot = Math.abs(slot);
      const d = this.SPACING_DECAY;
      // Reverse geometric series for forward movement
      // As slot goes negative, move further down (forward)
      return -((this.Y_BASE * (1 - Math.pow(d, absSlot))) / (1 - d));
    }
    const d = this.SPACING_DECAY;
    // Geometric series sum for real-valued slot:
    // Y_BASE * (1 - d^slot) / (1 - d)
    return (this.Y_BASE * (1 - Math.pow(d, slot))) / (1 - d);
  }

  private updateLayout(): void {
    // Reverse scroll direction: calculate from max scroll position
    const maxScroll = (this.cards.length - 1) * this.STEP;
    const activeIndex = (maxScroll - this.scrollTop) / this.STEP; // Reversed: subtract from max

    this.cards.forEach((_, index) => {
      const s = index - activeIndex; // 0 = closest, 1 = behind, etc.

      // Handle cards that are too far behind (disappearing at the top)
      // Let them continue moving backwards and scaling down as they fade
      if (s > this.MAX_VISIBLE - 1) {
        // Continue using the actual s value for position, but fade out
        const fadeStart = this.MAX_VISIBLE - 1;
        const fadeEnd = this.MAX_VISIBLE + 0.5; // Fade over a range
        const fadeRange = fadeEnd - fadeStart;
        const fadeProgress = Math.min(1, (s - fadeStart) / fadeRange);
        const fadeOpacity = Math.max(0, 1 - fadeProgress);

        // Continue the natural movement pattern
        const y = this.spacingForSlot(s);
        const z = s * this.DEPTH_PER_CARD;
        const scale = Math.max(0.3, 1 - s * this.SCALE_STEP); // Continue scaling down

        this.cardStyles[index] = {
          opacity: fadeOpacity,
          transform: `translate3d(0, ${y}px, ${z}px) scale(${scale})`,
          'pointer-events': 'none',
          'z-index': 1000 - index,
        };
        return;
      }

      // Handle cards that are already gone (s < -1)
      if (s < -1) {
        this.cardStyles[index] = {
          opacity: 0,
          transform: 'translate3d(0, 0, 0) scale(0.7)',
          'pointer-events': 'none',
          'z-index': 1000 - index,
        };
        return;
      }

      // Use actual s value for all calculations - no special cases needed
      // s = 0: front card (about to disappear)
      // s = 1: next card (becoming front)
      // s < 0: card moving forward (disappearing) - use negative slot
      // s > 1: cards behind

      // Calculate position using spacingForSlot (now handles negative slots)
      const y = this.spacingForSlot(s);

      // Calculate z and scale based on absolute value of s
      const absS = Math.abs(s);
      const z = s * this.DEPTH_PER_CARD; // s negative = forward (positive z)
      let scale =
        s < 0
          ? 1 + absS * this.SCALE_STEP // Scale up as it moves forward
          : 1 - absS * this.SCALE_STEP; // Scale down as it moves back

      // Fade out for disappearing front card (s < 0)
      let opacity = 1;
      if (s < 0 && s >= -1) {
        const t = 1 + s; // s:-1→0 => t:0→1
        opacity = Math.max(0, t);
      }

      opacity = Math.max(0, Math.min(1, opacity));
      scale = Math.max(0.7, scale);

      const zIndex = 1000 - index;

      this.cardStyles[index] = {
        opacity,
        transform: `translate3d(0, ${y}px, ${z}px) scale(${scale})`,
        'pointer-events': opacity > 0 ? 'auto' : 'none',
        'z-index': zIndex,
      };
    });

    // Use markForCheck instead of detectChanges for better performance during scroll
    this.cdr.markForCheck();
  }
}
