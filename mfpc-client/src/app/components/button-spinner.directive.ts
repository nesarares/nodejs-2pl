import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[buttonSpinner]',
})
export class ButtonSpinnerDirective {
  hostNativeElement;

  constructor(private renderer: Renderer2, hostElement: ElementRef) {
    this.hostNativeElement = hostElement.nativeElement;
  }

  @Input() set buttonSpinner(display: boolean) {
    if (display === true) {
      // show spinner
      this.renderer.addClass(this.hostNativeElement, 'is-button-loading');
    } else {
      // show default text
      this.renderer.removeClass(this.hostNativeElement, 'is-button-loading');
    }
  }
}
