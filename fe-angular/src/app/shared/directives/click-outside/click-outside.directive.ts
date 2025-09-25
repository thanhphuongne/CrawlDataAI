import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Directive({
  selector: '[clickOutside]'
})
export class AppClickOutSideDirective implements OnInit, OnDestroy {
  @Output() clickOutside = new EventEmitter<any>();
  captured = false;
  subs: Subscription;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.subs = fromEvent(document, 'click', { capture: true })
      .pipe(take(1))
      .subscribe(() => (this.captured = true));
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(target: any) {
    if (!this.captured) {
      return;
    }

    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.clickOutside.emit(this.elementRef.nativeElement);
    }
  }
}
