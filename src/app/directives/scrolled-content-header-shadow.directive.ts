import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[scrolledContentShadow]',
  standalone: true,
})
export class ScrolledContentHeaderShadowDirective
  implements OnChanges, OnDestroy
{
  @Input('scrolledContentShadow') public content?: IonContent;

  @Input('scrolledContentShadowThreshold') public threshold: number | undefined;

  public headerShadowShown: boolean = false;
  private subscription?: Subscription;

  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private readonly renderer: Renderer2,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private readonly elementRef: ElementRef,
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    for (const propertyName in changes) {
      if (changes.hasOwnProperty(propertyName)) {
        switch (propertyName) {
          case 'content':
            if (changes['content'].currentValue) {
              this.subscribeIonScroll();
            }
            break;
        }
      }
    }
  }

  private subscribeIonScroll(): void {
    this.subscription = this.content?.ionScroll.subscribe((event: any) => {
      if (event?.detail.isScrolling) {
        const newHeaderShadowShown: boolean =
          event.detail.scrollTop > (this.threshold ?? 0);
        if (newHeaderShadowShown !== this.headerShadowShown) {
          this.headerShadowShown = newHeaderShadowShown;
          if (newHeaderShadowShown) {
            this.renderer.addClass(this.elementRef.nativeElement, 'shadow');
          } else {
            this.renderer.removeClass(this.elementRef.nativeElement, 'shadow');
          }
        }
      }
    });
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
